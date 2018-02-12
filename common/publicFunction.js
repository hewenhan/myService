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

var  add = function (x, y) {
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

var getAuthMenu = function (rulesStr, callback) {
	if (rulesStr == '') {
		rulesStr = -1;
	}
	var getAuthMemuSql = "\
	SELECT\n\
	menu_title, auth_url\n\
	FROM uu.auth_rule\n\
	WHERE\n\
	id IN (" + rulesStr + ")\n\
	AND status = 1\n\
	ORDER BY sort;\n\
	";
	query(getAuthMemuSql, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		callback(rows);
	});
};

var getAuthRules = function (authGroups, callback) {
	if (authGroups == '') {
		authGroups = -1;
	}
	var getAuthRulesSql = "\
	SELECT\n\
	title, rules_id\n\
	FROM\n\
	uu.mobile_auth_group\n\
	WHERE\n\
	id in (" + authGroups + ")\n\
	AND status = 1;\n\
	";
	query(getAuthRulesSql, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		var rulesGroup = [];
		for (var i = 0; i < rows.length; i++) {
			rulesGroup = rulesGroup.concat(rows[i]['rules_id'].split(','));
		}
		Array.prototype.unique = function(){
			this.sort();
			var res = [this[0]];
			for(var i = 1; i < this.length; i++){
				if(this[i] !== res[res.length - 1]){
					res.push(this[i]);
				}
			}
			return res;
		}
		var rulesStr = rulesGroup.unique().toString();
		getAuthMenu(rulesStr, callback);
	});
};

this.checkMobileUserAuth = function (unionId, callback) {
	var authGroupCheckDataJson = {
		tableName: 'mobile_auth_group_access',
		field: ['group'],
		where: {
			unionid: unionId,
			status: 1
		}
	};
	select(authGroupCheckDataJson, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		var authGroups = '';
		for (var i = 0; i < rows.length; i++) {
			authGroups += (rows[i]['group']).toString();
			if (i != rows.length - 1) {
				authGroups += ','
			}
		}
		getAuthRules(authGroups, callback);
	});
};

this.checkMobileUserOwnDevice = function (unionId, callback) {
	var checkMobileUserOwnDeviceSql = '\
	SELECT\n\
	auth.device_id AS name,\n\
	claw.huge_area,\n\
	claw.area_id,\n\
	area.title AS area_name,\n\
	claw.shop_id,\n\
	shop.title AS shop_name,\n\
	claw.retailing,\n\
	claw.version\n\
	FROM uu.mobile_auth_device AS auth\n\
	LEFT JOIN cloudpoint.ot_prize_claw AS claw ON\n\
	auth.device_id = claw.name\n\
	LEFT JOIN cloudpoint_prize_claw.ot_prize_shop AS area ON\n\
	claw.area_id = area.id\n\
	LEFT JOIN cloudpoint_prize_claw.ot_prize_shop AS shop ON\n\
	claw.shop_id = shop.id\n\
	WHERE\n\
	auth.unionid = "' + unionId + '"\n\
	AND claw.status = 1\n\
	ORDER BY auth.device_id DESC;\n\
	';
	query(checkMobileUserOwnDeviceSql, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		callback(rows);
	});
};

this.getAllDeviceList = function (callback) {
	var getAllDeviceListSql = "\
	SELECT\n\
	claw.name,\n\
	claw.huge_area,\n\
	claw.area_id,\n\
	area.title AS area_name,\n\
	claw.shop_id,\n\
	shop.title AS shop_name,\n\
	claw.retailing,\n\
	claw.version,\n\
	claw.type\n\
	FROM cloudpoint.ot_prize_claw AS claw\n\
	LEFT JOIN cloudpoint_prize_claw.ot_prize_shop AS area ON\n\
	claw.area_id = area.id\n\
	LEFT JOIN cloudpoint_prize_claw.ot_prize_shop AS shop ON\n\
	claw.shop_id = shop.id\n\
	WHERE claw.status = 1\n\
	AND claw.device_type IN (\n\
	'7寸友游娃娃机',\n\
	'3寸友游娃娃机'\n\
	)\n\
	ORDER BY claw.name * 1;\n\
	";
	query(getAllDeviceListSql, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		callback(rows);
	});
};

this.getDeviceInfo = function (deviceId, callback) {
	if (typeof callback != 'function') {
		callback = function () {};
	}
	var _this = this;
	_this.reqDataApi('dwj/device/getinfo', {mac_id: deviceId}, function (err, deviceInfo) {
		if (err) {
			callback(err);
			return;
		}
		if (deviceInfo == null) {
			callback('server null response');
			return;
		}
		deviceInfo.name = deviceInfo.mac_id;
		deviceInfo.uniqueid = deviceInfo.fitting_id;
		callback(null, deviceInfo);
	});
};

this.getPayPlayList = function (deviceId, callback) {
	var _this = this;
	_this.reqDataApi('dwj/device/getcunsumestall', {mac_id: deviceId}, function (err, payInfo) {
		if (err) {
			callback(err);
			return;
		}
		if (payInfo == null) {
			callback('server null response');
			return;
		}
		if (payInfo.list == null) {
			callback('server null response');
			return;
		}
		callback(null, payInfo.list);
	});
};

this.getDeviceGears = function (deviceId, callback) {
	var _this = this;
	if (typeof callback == 'undefined') {
		callback = function () {
			return;
		};
	}
	_this.reqDataApi('dwj/device/getrechargestall', {mac_id: deviceId}, function (err, gears) {
		if (err) {
			callback(err);
			return;
		}
		if (gears == null) {
			callback('server null response');
			return;
		}
		if (gears.list == null) {
			callback('server null response');
			return;
		}
		var result = [];
		for (var i = 0; i < gears.list.length; i++) {
			result.push({
				id: gears.list[i].id,
				pay: Number((gears.list[i].pay_money / 100).toFixed(2)),
				bounses: Number((gears.list[i].bounses / 100).toFixed(2))
			});
		}
		result.sort(function (a, b) {return a.pay - b.pay});
		callback(null, result);
	});
};

this.getPayInfo = function (deviceId, payId, callback) {
	var _this = this;
	if (typeof callback == 'undefined') {
		callback = function () {
			return;
		};
	}
	_this.reqDataApi('dwj/device/getcunsumestallinfo', {mac_id: deviceId, stall_id: payId}, function (err, payInfo) {
		if (err) {
			callback(err);
			return;
		}
		if (payInfo == null) {
			callback('server null response');
			return;
		}
		var result = {
			money: Number((payInfo.list.pay_money / 100).toFixed(2)),
			number: payInfo.list.coin_num
		};
		callback(null, result);
	});
};

this.getDeviceRechargeInfo = function (deviceId, rechargeId, callback) {
	var _this = this;
	if (typeof callback == 'undefined') {
		callback = function () {
			return;
		};
	}
	_this.reqDataApi('dwj/device/getrechargestallinfo', {mac_id: deviceId, stall_id: rechargeId}, function (err, rechargeInfo) {
		if (err) {
			callback(err);
			return;
		}
		if (rechargeInfo == null) {
			callback('server null response');
			return;
		}
		var result = {
			pay: Number((rechargeInfo.list.pay_money / 100).toFixed(2)),
			bounses: Number((rechargeInfo.list.bounses / 100).toFixed(2))
		};
		callback(null, result);
	});
};

this.getDeviceInfoByThirdPartyId = function (partyNo, macId, callback) {
	macId = macId.toLowerCase();
	var getDeviceInfoSql = "\
	SELECT\n\
	*\n\
	FROM cloudpoint_erp.erp_mac\n\
	WHERE is_third_party = " + partyNo + " AND fitting_id = '" + macId + "' AND status = 1\n\
	";
	query(getDeviceInfoSql, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		if (rows.length == 0) {
			err = 'has no device in table';
			callback(err);
			return;
		}
		callback(null, rows[0]);
	});
};

this.createTempOrder = function (orderData, keyName, callback) {
	var TTL = 7200;
	var key = 'uu_temp_trade_no' + keyName;
	var value = JSON.stringify(orderData);
	redis.set(key, value, TTL, function (err) {
		if (err) {
			callback(err);
		}
		console.log(value);
		callback(null);
	});
};

this.getUserInfoByUnionId = function (unionid, callback) {
	var getUserPointJson = {
		tableName: 'user_center_info',
		where: {
			unionid: unionid
		}
	};
	select(getUserPointJson, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		if (rows.length == 0) {
			callback('don\'t have user');
			return;
		}
		var userInfo = rows[0];
		callback(null, userInfo);
	});
};
this.getOldUserInfoByUnionId = function (unionid, callback) {
	var getOldUserInfoByUnionIdSql = `
	SELECT
	*
	FROM cloudpoint_prize_claw.ot_prize_wechat_user_info
	WHERE
	unionid = '${unionid}'
	ORDER BY update_time DESC
	LIMIT 1;
	`
	query(getOldUserInfoByUnionIdSql, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		if (rows.length == 0) {
			callback('don\'t have user');
			return;
		}
		var userInfo = rows[0];
		callback(null, userInfo);
	});
};

this.updateUserPoint = function (unionId, point, callback) {
	var updateUserPointData = {
		tableName: 'user_center_info',
		data: {
			point: point
		},
		where: {
			unionid: unionId
		}
	};
	update(updateUserPointData, function (err, results) {
		if (err) {
			callback('扣点失败，请重试');
			return;
		}
		callback(null, results);
	});
};

this.costUserPoint = function (unionId, operators, costValue, callback) {
	var _this = this;
	_this.getUserInfoByUnionId(unionId, function (err, userInfo) {
		if (err) {
			callback(err);
			return;
		}
		switch (operators) {
			case '+':
			var userPoint = userInfo.point + costValue;
			break;

			case '-':
			var userPoint = userInfo.point - costValue;
			break;

			default:
			callback('operators ERROR');
			return;
		}
		if (userPoint < 0) {
			callback('币数不足，请充值');
			return;
		}
		_this.updateUserPoint(unionId, userPoint, function (err, results) {
			callback(err, results);
		});
	});
};

var allocation = function (pointObj) {
	this.convertObj = function (pointObj) {
		for (var i in pointObj) {
			pointObj[i] = parseFloat(pointObj[i].toFixed(2));
		}
		return;
	};
	pointObj.transPoint = 0;
	if (pointObj.areaPoint + pointObj.areaBounses < pointObj.costPoint) {
		pointObj.transPoint = pointObj.costPoint - pointObj.areaPoint - pointObj.areaBounses;
		if (pointObj.areaPoint + pointObj.areaBounses + pointObj.globalPoint < pointObj.costPoint) {
			pointObj.globalBounses = pointObj.areaPoint + pointObj.areaBounses + pointObj.globalPoint + pointObj.globalBounses - pointObj.costPoint;
			pointObj.globalPoint = 0;
			pointObj.areaPoint = 0;
			pointObj.areaBounses = 0;
			this.convertObj(pointObj);
			return pointObj;
		}
		pointObj.globalPoint = pointObj.areaPoint + pointObj.areaBounses + pointObj.globalPoint - pointObj.costPoint;
		pointObj.areaPoint = 0;
		pointObj.areaBounses = 0;
		this.convertObj(pointObj);
		return pointObj;
	}
	if (pointObj.areaPoint < pointObj.costPoint) {
		pointObj.areaBounses = pointObj.areaPoint + pointObj.areaBounses - pointObj.costPoint;
		pointObj.areaPoint = 0;
		this.convertObj(pointObj);
		return pointObj;
	}
	pointObj.areaPoint = pointObj.areaPoint - pointObj.costPoint;
	this.convertObj(pointObj);
	return pointObj;
};

this.createOrderNumber = function (uniqueId) {
	var _this = this;
	return _this.createSecTimestamp(new Date()) + '-' + uniqueId + _this.randomStr(5);
};

this.updateUserPoint = function (c, params, callback) {
	var addPointCount = 2;
	var checkAddPointDone = function () {
		addPointCount--;
		if (addPointCount !== 0) {
			return;
		}
		c.autoCommit(function () {
			callback(null, parseFloat((params.finalPoint- params.costPoint).toFixed(2)));
		});
	};
	var updateGlobalPointSql = `UPDATE uu.user_wallet SET point = '${params.allocationPoint.globalPoint}', bounses = '${params.allocationPoint.globalBounses}' WHERE uid = '${params.userInfo.id}' AND area_id = '1';`;
	var updateAreaPointSql = `UPDATE uu.user_wallet SET point = '${params.allocationPoint.areaPoint}', bounses = '${params.allocationPoint.areaBounses}' WHERE uid = '${params.userInfo.id}' AND area_id = '${params.deviceInfo.area_id}';`
	c.transQuery(updateGlobalPointSql, function (err) {
		if (err) {
			callback(err);
			return;
		}
		checkAddPointDone();
	});
	c.transQuery(updateAreaPointSql, function (err, resluts) {
		if (err) {
			callback(err);
			return;
		}
		checkAddPointDone();
	});
};

this.insertTransOrder = function (c, params, callback) {
	var _this = this;

	var insertOrderCount = 2;
	var checkInsertOrderDone = function () {
		insertOrderCount--
		if (insertOrderCount !== 0) {
			return;
		}
		_this.updateUserPoint(c, params, callback);
	};

	var fromSql = `
	INSERT INTO uu.vr_recharge_record (
	amount, point, unionid, pay_type, out_trade_no, shop_id, device_id, system_type, status
	) VALUES (
	'-${params.allocationPoint.transPoint}', '-${params.allocationPoint.transPoint}', '${params.userInfo.unionid}', '3', '${_this.createOrderNumber(params.deviceInfo.uniqueid)}', '2', '0', '0', '1'
	);`;
	var toSql = `
	INSERT INTO uu.vr_recharge_record (
	amount, point, unionid, pay_type, out_trade_no, shop_id, device_id, system_type, status
	) VALUES (
	'${params.allocationPoint.transPoint}', '${params.allocationPoint.transPoint}', '${params.userInfo.unionid}', '3', '${_this.createOrderNumber(params.deviceInfo.uniqueid)}', '${params.deviceInfo.shop_id}', '${params.deviceInfo.id}', '0', '1'
	);`;
	c.transQuery(fromSql, function (err) {
		if (err) {
			callback(err);
			return;
		}
		checkInsertOrderDone();
	}).transQuery(toSql, function (err) {
		if (err) {
			callback(err);
			return;
		}
		checkInsertOrderDone();
	});
};

this.checkTransPoint = function (c, params, callback) {
	var _this = this;
	if (params.allocationPoint.transPoint != 0) {
		_this.insertTransOrder(c, params, callback);
		return;
	}
	_this.updateUserPoint(c, params, callback);
};

this.allocationUserPoint = function (c, params, callback) {
	var _this = this;
	params.finalPoint = parseFloat((params.areaPoint+ params.areaBounses + params.globalPoint + params.globalBounses).toFixed(2));

	if (params.finalPoint < params.costPoint) {
		c.autoRollback(function () {
			callback('POINT IS NOT ENOUGH');
			return;
		});
		return;
	}

	params.allocationPoint = allocation({
		areaPoint: params.areaPoint,
		areaBounses: params.areaBounses,
		globalPoint: params.globalPoint,
		globalBounses: params.globalBounses,
		costPoint: params.costPoint
	});

	_this.checkTransPoint(c, params, callback);
};

this.createAccount = function (c, params, callback) {
	var _this = this;

	var checkCreateAccount = function () {
		params.createAccountCount--;
		if (params.createAccountCount !== 0) {
			return;
		}
		_this.allocationUserPoint(c, params, callback);
	};

	if (!params.globalAccount) {
		var createGlobalAccountSql = `INSERT INTO uu.user_wallet (uid, area_id, point, bounses) VALUES ('${params.userInfo.id}', '1', '0', '0');`;
		c.transQuery(createGlobalAccountSql, function (err) {
			if (err) {
				callback(err);
				return;
			}
			checkCreateAccount();
		});
	}
	if (!params.areaAccount) {
		var createAreaAccountSql = `INSERT INTO uu.user_wallet (uid, area_id, point, bounses) VALUES ('${params.userInfo.id}', '${params.deviceInfo.area_id}', '0', '0');`;
		c.transQuery(createAreaAccountSql, function (err) {
			if (err) {
				callback(err);
				return;
			}
			checkCreateAccount();
		});
	}
	checkCreateAccount();
};

this.lockSelectUserPoint = function (c, params, callback) {
	var _this = this;
	params.areaPoint = 0;
	params.areaBounses = 0;
	params.globalPoint = 0;
	params.globalBounses = 0;
	params.finalPoint = 0;
	params.createAccountCount = 1;
	params.areaAccount = true;
	params.globalAccount = true;

	var lockCount = 2;
	var checkLock = function () {
		lockCount--;
		if (lockCount !== 0) {
			return;
		}
		_this.createAccount(c, params, callback);
	};

	var selectGlobalPointSql = `SELECT point, bounses FROM uu.user_wallet WHERE uid = ${params.userInfo.id} AND area_id = 1 FOR UPDATE`;
	var selectAreaPointSql = `SELECT point, bounses FROM uu.user_wallet WHERE uid = ${params.userInfo.id} AND area_id = ${params.deviceInfo.area_id} FOR UPDATE`;

	c.transQuery(selectGlobalPointSql, function (err, rows, sql) {
		if (err) {
			callback(err);
			return;
		}
		params.globalPoint = rows[0] == null ? 0 : rows[0].point;
		params.globalBounses = rows[0] == null ? 0 : rows[0].bounses;
		if (rows[0] == null) {
			params.globalAccount = false;
			params.createAccountCount++;
		}
		checkLock();
	}).transQuery(selectAreaPointSql, function (err, rows, sql) {
		if (err) {
			callback(err);
			return;
		}
		params.areaPoint = rows[0] == null ? 0 : rows[0].point;
		params.areaBounses = rows[0] == null ? 0 : rows[0].bounses;
		if (rows[0] == null) {
			params.areaAccount = false;
			params.createAccountCount++;
		}
		checkLock();
	});
};

this.addPoint = function (params, callback) {
	var _this = this;
	query('transAction', function (c) {
		_this.lockSelectUserPoint(c, params, callback);
	});
};

this.addUserAreaPoint = function (unionId, deviceId, addPoint, callback) {
	var _this = this;
	var costPoint = 0 - addPoint;
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	var cbCount = 1;
	if (deviceId == null) {
		deviceId = 0;
	}
	_this.getDeviceInfo(deviceId, function (err, deviceInfo) {
		if (err) {
			callback(err);
			return;
		}
		_this.getUserInfoByUnionId(unionId, function (err, userInfo) {
			if (err) {
				callback(err);
				return;
			}
			var params = {
				deviceInfo: deviceInfo,
				userInfo: userInfo,
				costPoint: costPoint
			};
			_this.addPoint(params, callback);
		});
	});
};

// var playClawObj = {
// 	uniqueId: '7cc70971f7be',
// 	amount: 20,
// 	number: 15,
// 	openId: 'qwerqwer',
// 	unionId: 'qwerqwer',
// 	shopId: 13,
// 	prizeClawId: 500
// };
this.playClaw = function (playClawObj, callback) {
	var _this = this;
	var insertDataJson = {
		tableName: "cloudpoint.ot_prize_claw_recharge",
		data: {
			order_number: _this.createSecTimestamp(new Date()) + '-' + playClawObj.uniqueId + _this.randomStr(5),
			amount: playClawObj.amount * 100,
			payment: 15,
			order_status: 2,
			number: playClawObj.number,
			openid: playClawObj.openId,
			unionid: playClawObj.unionId,
			prize_shop_id: playClawObj.shopId,
			source: playClawObj.prizeClawId,
			type: 0,
			create_time: _this.secTimestamp(new Date()),
			update_time: _this.secTimestamp(new Date()),
			status: 1
		}
	};
	insert(insertDataJson, function (err, results) {
		callback(err, results, insertDataJson.data.order_number);
	});

	websocketAdmin.connection.sendCommand(playClawObj.uniqueId, {
		type: 'count',
		count: playClawObj.number,
		serial: insertDataJson.data.order_number
	}, function () {

	});
	redis.hSet(`order_hash_${insertDataJson.data.order_number}`, 'push_coin', `${insertDataJson.data.order_number}_${playClawObj.uniqueId}_${playClawObj.number}`);
	redis.zAdd('order_devicerun', `${insertDataJson.data.order_number}_${playClawObj.uniqueId}_${playClawObj.number}`, insertDataJson.data.update_time);
	redis.zAdd('order_devicerun_http', `${insertDataJson.data.order_number}_${playClawObj.uniqueId}_${playClawObj.number}`, playClawObj.name);
};

this.getPartyInfo = function (partyNo, callback) {
	var getPartyInfoJson = {
		tableName: "third_party_info",
		where: {
			party_no: partyNo
		},
		limit: "1"
	};
	select(getPartyInfoJson, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		if (rows.length == 0) {
			callback('no party info');
			return;
		}
		var partyInfo = rows[0]
		callback(null, partyInfo);
	});
};

this.getDeviceEventCount = function (prizeClawId, shopId, event, callback) {
	var selectJson = {
		tableName: 'device_event_log',
		field: ['count'],
		where: {
			tag: event,
			device_id: prizeClawId,
			shop_id: shopId
		},
		limit: '1'
	}
	select(selectJson,function (err, rows) {
		if (err) {
			console.log(err);
			callback('get device ' + event + ' count err');
			return;
		}
		if (rows.length == 0) {
			callback(err, 0);
			return;
		}
		callback(err, rows[0]['count']);
	});
};

this.updateDeviceEventCount = function (prizeClawId, shopId, event, number, callback) {
	if (callback == null) {
		callback = function () {};
	}

	var updateDeviceEventCountJson = {
		tableName: 'device_event_log',
		data: {
			tag: event,
			shop_id: shopId,
			device_id: prizeClawId,
			count: number
		},
		uniqueFieldName: ['tag', 'shop_id', 'device_id']
	};

	insertOrUpdate(updateDeviceEventCountJson, callback);
};

this.getDeviceTestCount = function (prizeClawId, shopId, callback) {
	var selectJson = {
		tableName: 'device_event_log',
		field: ['count'],
		where: {
			tag: 'lowPrizePayCheck',
			device_id: prizeClawId,
			shop_id: shopId
		},
		limit: '1'
	}
	select(selectJson,function (err, rows) {
		if (err) {
			console.log(err);
			callback('get device test count err');
			return;
		}
		if (rows.length == 0) {
			callback(err, 0);
			return;
		}
		callback(err, rows[0]['count']);
	});
};

this.clearDeviceTestCount = function (prizeClawId, shopId, callback) {
	var clearDeviceTestCountJson = {
		tableName: 'device_event_log',
		data: {
			count: 0
		},
		where: {
			tag: 'lowPrizePayCheck',
			device_id: prizeClawId,
			shop_id: shopId
		}
	}
	update(clearDeviceTestCountJson, function (err) {
		if (err) {
			console.log(err);
			callback(err);
			return;
		}
		callback(err, true);
	});
};

this.getDeviceRunTIme = function (uniqueId, date, callback) {
	redis.get('websocket_deviceRuntime_' + uniqueId + '_' + date, callback);
};

this.saveRefundLog = function (rechargeId, refund, unionid, operatorUid, callback) {

	var saveRefundLogJson = {
		tableName: 'uu.refund_log',
		data: {
			recharge_id: rechargeId,
			refund: refund,
			unionid: unionid,
			operator_uid: operatorUid
		}
	};

	insert(saveRefundLogJson, callback);
};

this.verifyVoucherCode = function (code, callback) {
	var verifyVoucherCodeJson = {
		tableName: 'uu.voucher',
		where: {
			voucher_number: code,
			released: 1,
			status: 1,
			used: 0
		},
		limti: 1
	};

	select(verifyVoucherCodeJson, function (err, rows) {
		if (err) {
			console.log(err);
			callback('GET VOUCHER ERROR');
			return;
		}
		if (rows.length == 0) {
			callback('INVALID VOUCHER');
			return;
		}
		if (new Date(rows[0].expire_time) < new Date()) {
			callback('INVALID VOUCHER');
			return;
		}
		callback(err, rows[0].coin_number, rows[0].area_id);
	});
};

var querystring = require('querystring');
var crypto = require('crypto');

this.dataApiSign = function (data) {
	var _this = this;
	var data = _this.jsonSortByKeys(data);
	var str = querystring.stringify(data);
	var shaObj = crypto.createHash('sha1');
	shaObj.update(str);
	return shaObj.digest("HEX").toUpperCase();
};

this.reqDataApi = function (apiName, data, callback) {
	var _this = this;
	if (typeof callback != "function") {
		callback = function () {};
	}
	data.sign = _this.dataApiSign(data);
	var options = {
		url: __config.dataApi + apiName,
		data: data
	};

	reqHttp(options, function (err, results) {
		if (err) {
			console.log(`${new Date()}: REQ API ERROR ${err}`);
			callback(err);
			return;
		}
		if (results.code != 0) {
			callback(results.msg);
			return;
		}
		callback(null, results.data);
	});
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