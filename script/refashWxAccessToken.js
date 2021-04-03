var reqHttp = require("request_http");
var __config = require("../config/config");
var redis = require('redis-pool-fns')(__config.redis);

var saveJsApiTicket = function (jsApiTicket) {
	redis.set(`jsApiTicket_${__config.wechat.appId}`, jsApiTicket);
};

var saveAccessToken = function (accessToken) {
	redis.set(`accessToken_${__config.wechat.appId}`, accessToken);
};

var getJsApiTicket = function (accessToken) {
	var options = {
		url: "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
		data: {
			type: "jsapi",
			access_token: accessToken
		}
	};

	reqHttp(options, function (err, jsApiTicketObj) {
		if (err) {
			console.log(`${new Date()}: GET JSAPI_TICKET ERROR`);
			return;
		}

		console.log(`GEN ${__config.wechat.appId} JSAPI_TICKET SUCCESS: ${jsApiTicketObj.ticket}`);
		saveJsApiTicket(jsApiTicketObj.ticket);
	});
};

var getAccessToken = function () {
	var options = {
		url: "https://api.weixin.qq.com/cgi-bin/token",
		data: {
			grant_type: "client_credential",
			appid: __config.wechat.appId,
			secret: __config.wechat.secret
		}
	};

	reqHttp(options, function (err, accessTokenObj) {
		if (err) {
			console.log(`${new Date()}: GET ACCESS_TOKEN ERROR`);
			return;
		}

		console.log(`GEN ${__config.wechat.appId} ACCESS_TOKEN SUCCESS: ${accessTokenObj.access_token}`);

		saveAccessToken(accessTokenObj.access_token);
		getJsApiTicket(accessTokenObj.access_token);
		setTimeout(getAccessToken, accessTokenObj.expires_in * 0.8 * 1000);
	});
};

getAccessToken();
