var insertRedPackData = function (req, res) {
	insert({
		tableName: "uu.marketing_redpack",
		data: {
			identity: req.allParams.identity,
			rid: req.allParams.rid,
			title: req.allParams.title,
			min_points: req.allParams.minPoints,
			release_num: req.allParams.releaseNum,
			num_left: req.allParams.releaseNum,
			total_points: req.allParams.totalPoints,
			points_left: req.allParams.totalPoints,
			start_time: req.allParams.startTime,
			end_time: req.allParams.endTime
		}
	}, function (err, result) {
		if (err) {
			res.error(`CREATE RED PACK ERROR`);
			return;
		}
		res.success();
		common.getWxaCode(result.insertId);
	});
};

var redPackDataFilter = function (req, res) {
	if (req.allParams.identity != "yy" && req.allParams.identity != "yc") {
		res.error(`PARAMS identity ERROR`);
		return;
	}

	if (req.allParams.totalPoints / req.allParams.releaseNum < req.allParams.minPoints) {
		res.error(`最小币数 不能大于 总币数/红包总数`);
		return;
	}

	var now = new Date();
	var startTime = new Date(req.allParams.startTime);
	var endTime = new Date(req.allParams.endTime);

	if (startTime == "Invalid Date" || endTime == "Invalid Date") {
		res.error(`PARAMS startTime or endTime Invalid Date`);
		return;
	}

	if (endTime.getTime() - startTime.getTime() < 3600 * 1000) {
		res.error(`活动结束时间 - 活动开始时间 < 1小时`);
		return;
	}

	if (endTime.getTime() - startTime.getTime() > 3600 * 1000 * 24 * 90) {
		res.error(`活动结束时间 - 活动开始时间 > 90天`);
		return;
	}
	
	if (startTime.getTime() - now.getTime() < 3600 * 1000) {
		res.error(`当前时间距离活动开始时间必须大于1小时`);
		return;
	}

	req.allParams.startTime = common.formatManTime(startTime);
	req.allParams.endTime = common.formatManTime(endTime);

	var checkDateTimeRangeSql = `
	SELECT
	id, title
	FROM
	uu.marketing_redpack
	WHERE
	identity = '${req.allParams.identity}'
	AND rid = '${req.allParams.rid}'
	AND start_time >= '${req.allParams.startTime}'
	AND end_time <= '${req.allParams.endTime}'
	`

	query(checkDateTimeRangeSql, function (err, row) {
		if (err) {
			res.error(`checkDateTimeRange ERROR`);
			return;
		}
		if (row.length > 0) {
			var str = "";
			for (var i = 0; i < row.length; i++) {
				str += `${row[i].id}-${row[i].title}_`
			}
			res.error(`活动时间范围与【${str}】存在冲突`);
			return;
		}
		insertRedPackData(req, res);
	});

};

module.exports = function (req, res, next) {
	req.verifyParams({
		"identity": "*",
		"rid": "*",
		"title": "*",
		"minPoints": "*",
		"releaseNum": "*",
		"totalPoints": "*",
		"startTime": "*",
		"endTime": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}
		redPackDataFilter(req, res);
	});
};
