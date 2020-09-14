var updateFileUploadStat = (req, res) => {
	updateFileUploadStatJson = {
		tableName: 'service.user_resource',
		data: {
			status: 1
		},
		where: {
			uid: req.allParams.userInfo.id,
			url: req.allParams.url,
			status: 0
		}
	};

	update(updateFileUploadStatJson, (err, result) => {
		if (err) {
			res.error('UPDATE user_resource ERROR');
			return;
		}
		res.success();
	});
};

module.exports = (req, res, next) => {
	req.verifyParams({
		"url": "*",
	}, (rejected) => {
		if (rejected) {
			return;
		}
		updateFileUploadStat(req, res);
	});
};