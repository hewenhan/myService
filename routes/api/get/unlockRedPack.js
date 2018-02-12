var updateRedPackStat = function (req, res) {
	var updateRedPackStatJson = {
		tableName: "uu.marketing_redpack",
		data: {
			num_left: req.thisData.num_left - 1,
			points_left: req.thisData.points_left - req.thisData.allocationPoints
		},
		where: {
			id: req.thisData.id
		}
	};

	update(updateRedPackStatJson, function (err, results) {
		if (err) {
			console.log(`updateRedPackError`);
			return;
		}
	});

	var insertRedPackLogJson = {
		tableName: "uu.marketing_redpack_unlock",
		data: {
			red_pack_id: req.allParams.id,
			unionid: req.allParams.unionId,
			type: req.allParams.type,
			get_point: req.thisData.allocationPoints
		}
	};

	insert(insertRedPackLogJson, function (err, results) {
		if (err) {
			console.log(`updateRedPackError`);
			return;
		}
	});
};

var updateYyUserPoint = function (req, res) {
	var updateYyUserPointSql = `
	INSERT INTO uu.user_wallet
	(uid, area_id, point)
	VALUES
	(${req.thisData.uId}, ${req.thisData.rid}, ${req.thisData.allocationPoints})
	ON DUPLICATE KEY UPDATE point = point + ${req.thisData.allocationPoints};
	`;

	query(updateYyUserPointSql, function (err, results) {
		if (err) {
			res.error(`updateUserPointError`);
			return;
		}

		res.success({
			addPoints: req.thisData.allocationPoints
		});
		updateRedPackStat(req);
	});
};

var updateYcUserPoint = function (req, res) {
	var nowTimeStamp = Date.parse(new Date()) / 1000;
	var updateYyUserPointSql = `
	INSERT INTO club_2g.user_wallet
	(user_id, partner_id, points, bounses, create_time, update_time, is_valid)
	VALUES
	(${req.thisData.uId}, ${req.thisData.rid}, 0, ${req.thisData.allocationPoints}, ${nowTimeStamp}, ${nowTimeStamp}, 1)
	ON DUPLICATE KEY UPDATE bounses = bounses + ${req.thisData.allocationPoints}, update_time = ${nowTimeStamp};
	`;

	query(updateYyUserPointSql, function (err, results) {
		if (err) {
			res.error(`updateUserPointError`);
			return;
		}

		res.success({
			addPoints: req.thisData.allocationPoints
		});
		updateRedPackStat(req);
	});
};

var getYyUid = function (req, res) {
	var getYyUidJson = {
		tableName: "uu.user_center_info",
		field: ["id"],
		where: {
			unionid: req.allParams.unionId
		}
	};

	select(getYyUidJson, function (err, rows) {
		if (err) {
			res.error(`checkRedPackUserError`);
			return;
		}

		if (rows.length == 0) {
			res.error(`用户授权错误`);
			return;
		}

		req.thisData.uId = rows[0].id;

		updateYyUserPoint(req, res);
	});
};

var getYcUid = function (req, res) {
	var getYyUidJson = {
		tableName: "club_2g.user_center_info",
		field: ["id"],
		where: {
			unionid: req.allParams.unionId
		}
	};

	select(getYyUidJson, function (err, rows) {
		if (err) {
			res.error(`checkRedPackUserError`);
			return;
		}

		if (rows.length == 0) {
			res.error(`用户授权错误`);
			return;
		}

		req.thisData.uId = rows[0].id;

		updateYcUserPoint(req, res);
	});
};

var checkRedPackLog = function (req, res) {
	var checkRedPackLogJson = {
		tableName: "uu.marketing_redpack_unlock",
		field: ["id"],
		where: {
			red_pack_id: req.allParams.id,
			unionid: req.allParams.unionId,
			type: req.allParams.type
		}
	};

	select(checkRedPackLogJson, function (err, rows) {
		if (err) {
			res.error(`checkRedPackUnLockError`);
			return;
		}

		if (rows.length != 0) {
			res.error(`红包已经解锁，请误重复解锁`);
			return;
		}

		if (req.thisData.identity == 'yy') {
			getYyUid(req, res);
			return;
		}

		if (req.thisData.identity == 'yc') {
			getYcUid(req, res);
			return;
		}

		res.error(`checkRedPackUnLockError`);
	});
};

var getRedPackInfo = function (req, res) {
	var options = {
		url: 'http://' + __root + '/api/getRedPackInfo',
		data: {
			id: req.allParams.id
		}
	};
	reqHttp(options, function (err, result) {
		if (err) {
			console.log(err);
			res.error('getRedPackInfoError');
			return;
		}
		if (!result.success) {
			res.error(result.msg);
			return;
		}
		req.thisData = result.data;

		if (req.thisData.status_describe != 'actived') {
			var rason = "未知原因";
			switch (req.thisData.status_describe) {
				case "standBy":
				rason = "活动未开始";

				break;
				case "ended":
				rason = "活动已结束";

				break;
				case "forbidden":
				rason = "活动被终止";

				break;
				default:

				break;
			}
			res.error(`当前红包，由于${rason}，无法解锁哦`);
			return;
		}

		var numLeft = req.thisData.num_left;
		var pointsLeft = req.thisData.points_left;
		var minPoints = req.thisData.min_points;

		var maxPoints = pointsLeft - (numLeft - 1) * minPoints;

		if (req.thisData.num_left == 0) {
			res.error("手慢了~红包派完了~");
			return;
		}

		if (maxPoints < 1) {
			res.error("allocationError");
			return;
		}

		var avgPoints = pointsLeft / numLeft;
		var maxLimitBase = avgPoints + avgPoints / 4;
		var minLimitBase = avgPoints - avgPoints / 4;
		if (minLimitBase < minPoints) {
			minLimitBase = minPoints;
		}

		if (numLeft == 1) {
			req.thisData.allocationPoints = maxPoints;
		} else {
			req.thisData.allocationPoints = Math.round(minLimitBase + Math.random() * (maxLimitBase - minPoints));
		}

		checkRedPackLog(req, res);
	});
};

var paramsFilter = function (req, res) {
	var typeList = [
	"firstUnlock",
	"shareUnlock"
	];

	var inTypeList = false;

	for (var i = 0; i < typeList.length; i++) {
		if (req.allParams.type == typeList[i]) {
			inTypeList = true;
			break;
		}
	}

	if (!inTypeList) {
		res.error("typeError");
		return;
	}

	getRedPackInfo(req, res);
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*",
		"unionId": "*",
		"type": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		paramsFilter(req, res);
	});
};
