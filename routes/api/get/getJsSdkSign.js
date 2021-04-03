var weChatConfig = require('../../../config/config').wechat;
var jsSHA = require("jssha");

var createTimeStamp = function () {
	return parseInt(new Date().getTime() / 1000) + '';
};

var calcSignature = function (ticket, noncestr, ts, url) {
	var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
	shaObj = new jsSHA('SHA-1', 'TEXT');
	shaObj.update(str);
	return shaObj.getHash("HEX");
};

module.exports = function (req, res, next) {
	var url = req.headers.referer;
	var noncestr = common.randomStr(13);
	var timestamp = createTimeStamp();

	redis.get(`jsApiTicket_${__config.wechat.appId}`, function (err, ticket) {
		if (err) {
			console.log(err);
			res.jsonp(err);
			return;
		}

		var signData = {
			appId: __config.wechat.appId,
			nonceStr: noncestr,
			timestamp: timestamp,
			url: url,
			signature: calcSignature(ticket, noncestr, timestamp, url),
		};
		res.jsonp(signData);
		console.log('SEND A SIGN TO: ' + url);
	});
};
