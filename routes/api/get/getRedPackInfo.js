var checkDone = function (req, res) {
	req.thisData.getInfoCount--;
	if (req.thisData.getInfoCount != 0) {
		return;
	}

	res.success(req.thisData.result);
};

var getRedPackUserNum = function (req, res) {
	var getRedPackUserNumSql = `
	SELECT 
	count(distinctrow unionid) AS user_count
	FROM
	uu.marketing_redpack_unlock
	WHERE
	red_pack_id = '${req.allParams.id}'
	`;

	query(getRedPackUserNumSql, function (err, rows) {
		if (err) {
			res.error(`getRedPackUserCountInfo ERROR`);
			return;
		}
		if (rows.length == 0) {
			req.thisData.result.user_count = 0
			checkDone(req, res);
			return;
		}
		req.thisData.result.user_count = rows[0].user_count
		checkDone(req, res);
	});
};

var getRedPackDataInfo = function (req, res) {
	var getRedPackDataInfoJson = {
		tableName: "uu.marketing_redpack",
		where: {
			id: req.allParams.id
		}
	};

	select(getRedPackDataInfoJson, function (err, rows) {
		if (err) {
			res.error(`getRedPackInfo ERROR`);
			return;
		}

		if (rows.length == 0) {
			res.error(`该红包不存在`);
			return;
		}

		var redPackData = rows[0];

		rows[0].start_time = common.formatManTime(rows[0].start_time);
		rows[0].end_time = common.formatManTime(rows[0].end_time);
		rows[0].create_time = common.formatManTime(rows[0].create_time);
		rows[0].update_time = common.formatManTime(rows[0].update_time);

		var nowDate = new Date();
		var startTime = new Date(rows[0].start_time);
		var endTime = new Date(rows[0].end_time);

		rows[0].expired = false;

		if (nowDate > endTime || rows[0].num_left == 0 || rows[0].points_left == 0) {
			rows[0].status_describe = 'ended';
			rows[0].expired = true;
		} else if (nowDate < startTime) {
			rows[0].status_describe = 'standBy';
		} else {
			rows[0].status_describe = 'actived';
		}

		if (rows[0].status == 0) {
			rows[0].status_describe = 'forbidden';
		}
		rows[0].writable = false;

		if (nowDate < startTime) {
			rows[0].writable = true;
		}

		for (var i in rows[0]) {
			req.thisData.result[i] = rows[0][i];
		}

		checkDone(req, res);
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		req.thisData = {};
		req.thisData.getInfoCount = 2;
		req.thisData.result = {};

		getRedPackDataInfo(req, res);
		getRedPackUserNum(req, res);
	});
};
