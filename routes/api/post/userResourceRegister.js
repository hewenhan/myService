module.exports = (req, res, next) => {
	req.verifyParams({
		"resourceId": "*",
	}, (rejected) => {
		var registerResourceJson = {
			tableName: 'service.user_resource',
			data: {
				status: 1
			},
			where: {
				id: req.allParams.resourceId,
				uid: req.allParams.userInfo.id,
				status: 0
			}
		};
		update(registerResourceJson, (err, result) => {
			if (err) {
				res.error('加入资源库错误');
				return;
			}
			if (result.changedRows === 0) {
				res.error('请勿加入重复资源');
				return;
			}
			res.success();
		});
	});
};
