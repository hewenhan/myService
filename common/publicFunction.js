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

this.dec2hex = function (str) {
	var dec = str.toString().split(''), sum = [], hex = [], i, s
	while(dec.length){
		s = 1 * dec.shift()
		for(i = 0; s || i < sum.length; i++){
			s += (sum[i] || 0) * 10
			sum[i] = s % 16
			s = (s - sum[i]) / 16
		}
	}
	while(sum.length){
		hex.push(sum.pop().toString(16))
	}
	return hex.join('');
};

var add = function (x, y) {
	var c = 0, r = [];
	var x = x.split('').map(Number);
	var y = y.split('').map(Number);
	while(x.length || y.length) {
		var s = (x.pop() || 0) + (y.pop() || 0) + c;
		r.unshift(s < 10 ? s : s - 10); 
		c = s < 10 ? 0 : 1;
	}
	if(c) r.unshift(c);
	return r.join('');
};

this.hex2dec = function (str) {
	var dec = '0';
	str.split('').forEach(function(chr) {
		var n = parseInt(chr, 16);
		for(var t = 8; t; t >>= 1) {
			dec = add(dec, dec);
			if(n & t) dec = add(dec, '1');
		}
	});
	return dec;
};

var hex2Arr = function (hex) {
	if (hex.length % 2 === 1) {
		hex = "0" + hex;
	}
	return hex.match(/../g).map(function(x) { return parseInt(x,16) });
}

this.hex2Buf = function (str) {
	return Buffer.from(hex2Arr(str));
};

this.formatTime = function (timeObject) {
	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(timeObject.getMonth() + 1, 2);
	var DD = formatNumLength(timeObject.getDate(), 2);
	var hh = formatNumLength(timeObject.getHours(), 2);
	var mm = formatNumLength(timeObject.getMinutes(), 2);
	var ss = formatNumLength(timeObject.getSeconds(), 2);
	var ms = formatNumLength(timeObject.getMilliseconds(), 3);
	return YYYY + '年 ' + MM + '月 ' + DD + '日 ' + hh + ':' + mm + ':' + ss;
};

this.formatManTime = function (timeObject) {
	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(timeObject.getMonth() + 1, 2);
	var DD = formatNumLength(timeObject.getDate(), 2);
	var hh = formatNumLength(timeObject.getHours(), 2);
	var mm = formatNumLength(timeObject.getMinutes(), 2);
	var ss = formatNumLength(timeObject.getSeconds(), 2);
	var ms = formatNumLength(timeObject.getMilliseconds(), 3);
	return YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
};

// time format: "23:59:59"
this.timeConvertToSec = function (timeString) {
	if (timeString == null) {
		return 'null';
	};
	var timeArr = timeString.split(':');
	timeArr = timeArr.map(function (cell) {
		return parseInt(cell);
	});
	if (timeArr.length != 3 || timeArr[0] > 838 || timeArr[0] < -838  || timeArr[1] > 59 || timeArr[1] < 0  || timeArr[2] > 59 || timeArr[2] < 0) {
		return 'time format error';
	}
	return timeArr[0] * 3600 + timeArr[1] * 60 + timeArr[2]
};

this.secConvertToTime = function (sec, format) {
	if (format == null) {
		format = 'HH:MM:SS';
	}

	var h = Math.floor(sec / 3600);
	var m = Math.floor(sec % 3600 / 60);
	var s = Math.floor(sec % 60);

	var HH = formatNumLength(h, 2);
	var MM = formatNumLength(m, 2);
	var SS = formatNumLength(s, 2);

	var formatArr = [
	[/h/gm, h],
	[/m/gm, m],
	[/s/gm, s],
	[/HH/gm, HH],
	[/MM/gm, MM],
	[/SS/gm, SS]
	];

	var result = format;
	for (var i = 0; i < formatArr.length; i++) {
		result = result.replace(formatArr[i][0], formatArr[i][1]);
	}

	return result;
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
	var length = parseInt(length);
	var str = '';
	if (length / 25 >= 1) {
		for (var i = 0; i < Math.floor(length / 25); i++) {
			str += Math.random().toString(36).substr(2, 25);
		}
	}
	str += Math.random().toString(36).substr(2, length % 25);
	return str;
};

this.createManTimestamp = function (timeObject) {
	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(timeObject.getMonth() + 1, 2);
	var DD = formatNumLength(timeObject.getDate(), 2);
	var hh = formatNumLength(timeObject.getHours(), 2);
	var mm = formatNumLength(timeObject.getMinutes(), 2);
	var ss = formatNumLength(timeObject.getSeconds(), 2);
	var ms = formatNumLength(timeObject.getMilliseconds(), 3);
	return YYYY + MM + DD + hh + mm + ss + ms;
};

this.createSecTimestamp = function (timeObject) {
	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(timeObject.getMonth() + 1, 2);
	var DD = formatNumLength(timeObject.getDate(), 2);
	var hh = formatNumLength(timeObject.getHours(), 2);
	var mm = formatNumLength(timeObject.getMinutes(), 2);
	var ss = formatNumLength(timeObject.getSeconds(), 2);
	return YYYY + MM + DD + hh + mm + ss;
};

this.secTimestamp = function (timeObject) {
	return (Date.parse(timeObject) / 1000);
};

this.createManDate = function (timeObject) {
	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(timeObject.getMonth() + 1, 2);
	var DD = formatNumLength(timeObject.getDate(), 2);
	return YYYY + '-' + MM + '-' + DD;
};

this.getWxaAccessToken = function (callback) {
	redis.get(`accessToken_${__config.wxa.appId}`, function (err, accessToken) {
		callback(accessToken);
	});
};

var request = require('request');
this.getWxaCode = function (id) {
	common.getWxaAccessToken(function (token) {
		var wxaCodeStream = request({
			method: 'POST',
			url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + token,
			body: JSON.stringify({
				path: "pages/redpacket/redpacket?id=" + id,
				auto_color: false,
				width: 430
			})
		});

		co(function* () {
			var result = yield ossClient.putStream(`wxa_code/redpack_${id}.jpg`, wxaCodeStream);

			if (result.url == null) {
				console.log(`CREATE WXA_CODE ERROR`);
				console.log(result);
				return;
			}
			update({
				tableName: "uu.marketing_redpack",
				data: {
					wxa_code: result.url
				},
				where: {
					id: id
				}
			}, function (err, result) {
				if (err) {
					console.log(`CREATE WXA_CODE ERROR`);
					return;
				}
				console.log(`CREATE WXA_CODE ${id} SUCCESS`);
			});
		})

	});
};