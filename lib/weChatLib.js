var weChatConfig = require('../config/config').wechat;
var https = require('https');
var querystring = require('querystring');
var md5 = require('md5');
var piXml = require('pixl-xml');
var xml = require('xml');

var weChatLib = function () {
	this.appId = weChatConfig.appId;
	this.secret = weChatConfig.secret;
	this.mch_id = weChatConfig.mch_id;
	this.api_key = weChatConfig.api_key;

	return this;
};

weChatLib.prototype.weChatSign = function(data) {
	delete data.sign;
	var signQuery = common.jsonSortByKeys(data);
	signQuery = querystring.stringify(signQuery, null, null, {encodeURIComponent: querystring.unescape}) + '&key=' + this.api_key;
	var result = md5(signQuery).toUpperCase();
	return result;
};

weChatLib.prototype.createWeChatXml = function (data, callback) {
	var xmlStr = "";
	var xmlElem = xml.element();
	var stream = xml({xml: xmlElem}, {stream: true});
	var keys = Object.keys(data);
	for (var i = 0; i < keys.length; i++) {
		var pushData = {};
		if (keys[i] == 'detail') {
			pushData[keys[i]] = {};
			pushData[keys[i]]._cdata = data[keys[i]];
		} else {
			pushData[keys[i]] = data[keys[i]];
		}
		xmlElem.push(pushData);
	}
	xmlElem.close();
	stream.on('data', function (chunk) {
		xmlStr += chunk + '\n';
	});
	stream.on('end', function () {
		callback(xmlStr);
	});
};

weChatLib.prototype.getUserInfoByOpenIdAndAccessToken = function (accessToken, openId, callback) {
	var options = {
		url: 'https://api.weixin.qq.com/sns/userinfo',
		data: {
			access_token: accessToken,
			openid: openId,
			lang: 'zh_CN'
		}
	};
	reqHttp(options, function (err, json) {
		if (err) {
			console.log(err);
			callback(err);
			return;
		}
		if (json.unionid == null) {
			callback(json);
			return;
		}
		callback(null, json);
	});
};

weChatLib.prototype.getUserOpenId = function (code, callback) {
	var options = {
		url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
		data: {
			appid: this.appId,
			secret: this.secret,
			code: code,
			grant_type: 'authorization_code'
		}
	};
	reqHttp(options, function (err, json) {
		if (err) {
			callback(err);
			return;
		}
		var oAuthAccessToken = json.access_token;
		if (oAuthAccessToken == null) {
			callback(json);
			return;
		}
		redis.set('oAuthAccessToken', oAuthAccessToken, json.expires_in);
		callback(err, json);
	});
};

weChatLib.prototype.getUserInfo = function (code, callback) {
	var thisObj = this;
	this.getUserOpenId(code, function (err, json) {
		if (err) {
			callback(err);
			return;
		}
		thisObj.getUserInfoByOpenIdAndAccessToken(json.access_token, json.openid, function (err, json) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, json);
		});
	});
};

weChatLib.prototype.createPrePayId = function (data, callback) {
	var thisObj = this;
	this.createWeChatXml(data, function (xmlStr) {
		var options = {
			method: 'post',
			url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
			headers: {
				'Content-Type': 'text/xml'
			},
			data: xmlStr
		};
		reqHttp(options, function (err, json) {
			if (err) {
				callback(err, sendToFrontObj);
				return;
			}
			if (json.return_code != "SUCCESS") {
				err = json;
				json = null;
				callback(err, json);
				return;
			}

			var sendToFrontObj = {
				appId: json.appid,
				timeStamp: (Date.parse(new Date()) / 1000).toString(),
				nonceStr: common.randomStr(6),
				package: 'prepay_id=' + json.prepay_id,
				signType: "MD5"
			};
			sendToFrontObj.paySign = thisObj.weChatSign(sendToFrontObj);
			console.log(sendToFrontObj);
			callback(err, sendToFrontObj);
		});
	});
};

weChatLib.prototype.createSignDate = function (data, callback) {
	data.sign = this.weChatSign(data);
	this.createPrePayId(data, callback);
};

weChatLib.prototype.createDataJson = function (dataObj, callback) {
	var data = {
		appid: this.appId,
		mch_id: this.mch_id,
		nonce_str: common.randomStr(16),
		body: '',  //must from outside
		out_trade_no: '',  //must from outside
		total_fee: 0,  //must from outside
		spbill_create_ip: '',  //must from outside
		notify_url: '',  //must from outside
		trade_type: 'JSAPI',
		openid: ''  //must from outside
	};
	var keys = Object.keys(dataObj);
	for (var i = 0; i < keys.length; i++) {
		data[keys[i]] = dataObj[keys[i]];
	}
	this.createSignDate(data, callback);
};

module.exports = new weChatLib();