const getUserResourcePage = (req, res) => {
	var getRecordJson = {
		tableName: 'service.user_resource',
		where: {
			uid: req.allParams.userInfo.id,
			status: 1
		},
		order: "create_time DESC"
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
	if (req.cookies.loginSession == null) {
		res.error('session key empty or expired');
		return;
	}

	res.thisData = {};
	res.thisData.result = {};

	common.getUseteLoginSession(req.cookies.loginSession, (err, userInfo) => {
		if (err) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		if (userInfo == null) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		req.allParams.userInfo = userInfo;
		getUserResourcePage(req, res);
	});
};
