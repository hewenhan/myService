var formatNumLength = function (int, length) {
	var intLength = int.toString().length;
	var freeLength = length - intLength;
	var fillStr = '';
	for (var i = 0; i < freeLength; i++) {
		fillStr += '0';
	}
	return fillStr + int.toString();
};

Array.prototype.hasObj = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

this.jsonSortByKeys = function (json) {
	var keys = Object.keys(json);
	keys.sort();
	var result = {};
	for (var i = 0; i < keys.length; i++) {
		result[keys[i]] = json[keys[i]];
	}
	return result;
};

this.randomStr = function (length) {
	var length    = parseInt(length);
	var str       = '';

	while (true) {
		var lessNum = str.length - length;
		if (lessNum >= 0) {
			str = str.substr(0, length);
			break;
		}
		var charList = Math.random().toString(36);
		str += charList.substr(2, charList.length - 2);
	}
	return str;
};

this.customFormatTime = function (timeObject, format) {

	if (timeObject instanceof Date === false) {
		return 'Error timeObject Type';
	}

	var format = format || "%YYYY-%MM-%DD %hh:%mm:%ss:%mss";

	var YY = (timeObject.getYear() - 100).toString();
	var M = timeObject.getMonth() + 1;
	var D = timeObject.getDate();
	var h = timeObject.getHours();
	var m = timeObject.getMinutes();
	var s = timeObject.getSeconds();
	var ms = timeObject.getMilliseconds();

	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(M, 2);
	var DD = formatNumLength(D, 2);
	var hh = formatNumLength(h, 2);
	var mm = formatNumLength(m, 2);
	var ss = formatNumLength(s, 2);
	var mss = formatNumLength(ms, 3);

	var replaceArr = [
	[/\%YYYY/g, YYYY],
	[/\%MM/g, MM],
	[/\%DD/g, DD],
	[/\%hh/g, hh],
	[/\%mm/g, mm],
	[/\%mss/g, mss],
	[/\%ss/g, ss],
	[/\%YY/g, YY],
	[/\%M/g, M],
	[/\%D/g, D],
	[/\%h/g, h],
	[/\%ms/g, ms],
	[/\%m/g, m],
	[/\%s/g, s]
	];

	for (var i = 0; i < replaceArr.length; i++) {
		format = format.replace(replaceArr[i][0], replaceArr[i][1]);
	}

	return format;
};

this.secTimestamp = function (timeObject) {
	return (Date.parse(timeObject) / 1000);
};

this.setUserLoginSession = function (userInfo, cb) {
	var self = this;

	var loginSession = `${common.randomStr(5)}${Date.now()}`;
	var redisLoginSessionKey = `loginSession_${loginSession}`;

	var expire = 86400;

	redis.hSetObj(redisLoginSessionKey, userInfo, (err) => {
		if (err) {
			cb(err);
			return;
		}
		redis.expire(redisLoginSessionKey, expire);
		cb(null, {session: loginSession, expire: expire * 1000});
	});
};

this.getUserInfoByLoginSession = function (session, cb) {
	var redisLoginSessionKey = `loginSession_${session}`;
	redis.hGetAll(redisLoginSessionKey, (err, userInfo) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, userInfo);
	});
};

this.delUserLoginSession = function (session, cb) {
	var redisLoginSessionKey = `loginSession_${session}`;
	redis.del(redisLoginSessionKey, cb);
};

var crypto = require('crypto');
this.generateRandomSha256Key = () => {
	var shaObj = crypto.createHash('sha256');
	shaObj.update(Date.now() + common.randomStr(5));
	return shaObj.digest("HEX");
};

this.uploader = function (stream, suffix, cdn, cb) {
	var co = require('co');
	cb = cb || function () {};

	co(function* () {
		var shaObj = crypto.createHash('sha256');
		shaObj.update(Date.now() + common.randomStr(5));
		var fileHash = shaObj.digest("HEX");

		var result = yield ossClient.putStream('userFiles/' + fileHash + '.' + suffix, stream, {timeout: 86400000});

		if (result.url == null) {
			cb(result);
			return;
		}
		if (cdn) {
			var fileUrl = cdn + result.name;
		} else {
			var fileUrl = result.url;
		}
		cb(null, fileUrl);
	}).catch(function (err) {
		console.log(err);
		cb(err);
	});
};

var uaParser = require('ua-parser-js');
this.updateUserLogin = (uid, ip, userAgent, cb) => {
	var self = this;

	var ua = uaParser(userAgent);

	var updateUserLoginJson = {
		tableName: 'service.user',
		data: {
			last_login_time: self.customFormatTime(new Date(), "%YYYY-%MM-%DD %hh:%mm:%ss"),
			last_login_ip: ip,
			user_agent: userAgent
		},
		where: {
			id: uid
		}
	};

	if (ua.device.model != null) {
		updateUserLoginJson.data.device = ua.device.model;
	}
	if (ua.device.vendor != null) {
		updateUserLoginJson.data.device_vendor = ua.device.vendor;
	}
	if (ua.device.type != null) {
		updateUserLoginJson.data.device_type = ua.device.type;
	}
	if (ua.os.name != null && ua.os.version != null) {
		updateUserLoginJson.data.os = ua.os.name;
	}
	if (ua.os.version != null) {
		updateUserLoginJson.data.os_version = ua.os.version;
	}
	if (ua.engine.name != null) {
		updateUserLoginJson.data.engine = ua.engine.name;
	}
	if (ua.engine.version != null) {
		updateUserLoginJson.data.engine_version = ua.engine.version;
	}
	if (ua.browser.name != null) {
		updateUserLoginJson.data.browser = ua.browser.name;
	}
	if (ua.browser.version != null) {
		updateUserLoginJson.data.browser_version = ua.browser.version;
	}

	update(updateUserLoginJson, cb);
};

this.removeEmoji = (str) => {
	var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	return str.replace(regex, '');
};
