const deleteOssObj = async (req) => {
	var isOssObj = new RegExp(`^${__config.cdn}`);
	if (!isOssObj.test(req.allParams.url)) {
		return;
	}
	ossObjName = req.allParams.url.replace(isOssObj, '');
	try {
		let result = await ossClient.delete(ossObjName);
		console.log(result);
	} catch (e) {
		console.log(e);
	}
}

const setResuourceInvisible = (req, res) => {
	var setResuourceInvisibleJson = {
		tableName: 'service.user_resource',
		data: {
			status: 0
		},
		where: {
			uid: req.allParams.userInfo.id,
			url: req.allParams.url,
			status: 1
		}
	};
	update(setResuourceInvisibleJson, function (err, result) {
		if (err) {
			console.log(err);
			res.error('删除资源失败');
			return;
		}
		if (result.affectedRows == 0) {
			res.error('然而资源信息并不存在～');
			return;
		}
		res.success();
		deleteOssObj(req);
	});
};

const getResuourceName = (req, res) => {
	var getResuourceNameJson = {
		tableName: 'service.user_resource',
		field: ['url'],
		where: {
			id: req.allParams.resourceId,
			uid: req.allParams.userInfo.id
		},
		limit: 1
	};

	select(getResuourceNameJson, (err, rows) => {
		if (err) {
			console.log(err);
			res.error('删除资源失败');
			return;
		}
		if (rows.length === 0) {
			res.error('然而资源信息并不存在～');
			return;
		}
		req.allParams.url = rows[0].url;
		setResuourceInvisible(req, res);
	});
};

module.exports = (req, res, next) => {
	req.verifyParams({
		"resourceId": "*",
	}, (rejected) => {
		if (rejected) {
			return;
		}

		getResuourceName(req, res);
	});
};
