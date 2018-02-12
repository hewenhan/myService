var updateRedPackData = function (req, res) {
	var updateRedPackDataJson = {
		tableName: "uu.marketing_redpack",
		data: {

		},
		where: {
			id: req.allParams.id
		}
	};

	if (req.allParams.title != null) {
		updateRedPackDataJson.data.title = req.allParams.title;
	}
	if (req.allParams.minPoints != null) {
		updateRedPackDataJson.data.min_points = req.allParams.minPoints;
	}
	if (req.allParams.releaseNum != null) {
		updateRedPackDataJson.data.release_num = req.allParams.releaseNum;
		updateRedPackDataJson.data.num_left = req.allParams.releaseNum;
	}
	if (req.allParams.totalPoints != null) {
		updateRedPackDataJson.data.total_points = req.allParams.totalPoints;
		updateRedPackDataJson.data.points_left = req.allParams.totalPoints;
	}
	if (req.allParams.startTime != null) {
		updateRedPackDataJson.data.start_time = req.allParams.startTime;
	}
	if (req.allParams.endTime != null) {
		updateRedPackDataJson.data.end_time = req.allParams.endTime;
	}
	if (req.allParams.status != null) {
		updateRedPackDataJson.data.status = req.allParams.status;
	}

	update(updateRedPackDataJson, function (err, result) {
		if (err) {
			res.error("updateRedPackDataError");
			return;
		}
		res.success();
	});
};

var editFilter = function (req, res) {

	if (req.allParams.title != null) {
		req.thisData.title = req.allParams.title;
	}
	if (req.allParams.minPoints != null) {
		req.thisData.min_points = req.allParams.minPoints;
	}
	if (req.allParams.releaseNum != null) {
		req.thisData.release_num = req.allParams.releaseNum;
	}
	if (req.allParams.totalPoints != null) {
		req.thisData.total_points = req.allParams.totalPoints;
	}
	if (req.allParams.startTime != null) {
		req.thisData.start_time = req.allParams.startTime;
	}
	if (req.allParams.endTime != null) {
		req.thisData.end_time = req.allParams.endTime;
	}
	if (req.allParams.status != null) {
		req.thisData.status = req.allParams.status;
	}

	if (req.thisData.total_points / req.thisData.release_num < req.thisData.min_points) {
		res.error(`最小币数 不能大于 总币数/红包总数`);
		return;
	}

	var now = new Date();
	var startTime = new Date(req.thisData.start_time);
	var endTime = new Date(req.thisData.end_time);

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

	req.thisData.start_time = common.formatManTime(startTime);
	req.thisData.end_time = common.formatManTime(endTime);

	var checkDateTimeRangeSql = `
	SELECT
	id, title
	FROM
	uu.marketing_redpack
	WHERE
	identity = '${req.thisData.identity}'
	AND rid = '${req.thisData.rid}'
	AND start_time >= '${req.thisData.start_time}'
	AND end_time <= '${req.thisData.end_time}'
	AND id != '${req.thisData.id}'
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
		updateRedPackData(req, res);
	});
};

var getRedPackDataInfo = function (req, res) {

	if (Object.keys(req.allParams).length <= 1) {
		res.error('NO CHANGE');	
		return;
	}

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
		if (!result.data.writable) {
			res.error(`当前红包，不可编辑`);
			return;
		}
		req.thisData = result.data;
		editFilter(req, res);
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		getRedPackDataInfo(req, res);
	});
};
