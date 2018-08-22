const getUserResourcePage = (req, res) => {
	var getRecordJson = {
		tableName: 'service.user_resource',
		where: {
			uid: req.allParams.userInfo.id,
			status: 1
		},
		order: "update_time DESC"
	};
	selectPrePage(getRecordJson, req.allParams.startId || 0, req.allParams.limit || 100, function (err, rows, lastId, hasNext) {
		if (err) {
			result.msg = '获取充值记录列表失败';
			res.jsonp(result);
			return;
		}
		res.thisData.result.hasNext = hasNext;
		res.thisData.result.resourceList = rows;
		res.thisData.result.lastId = lastId;
		res.success(res.thisData.result);
	});
};

module.exports = (req, res, next) => {
	res.thisData = {};
	res.thisData.result = {};
	getUserResourcePage(req, res);
};
