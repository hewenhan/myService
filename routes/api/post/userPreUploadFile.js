var insertUserResource = (req, res) => {
	var insertUserResourceJson = {
		tableName: 'service.user_resource',
		data: {
			uid: req.allParams.userInfo.id,
			filename: req.allParams.fileName,
			mimetype: req.allParams.mimeType,
			url: req.allParams.url,
			md5: req.allParams.md5,
			status: 0
		}
	};

	insert(insertUserResourceJson, (err) => {
		if (err) {
			res.error('INSERT user_resource ERROR');
			return;
		}
		res.thisData.result.url = req.allParams.url;
		res.success(res.thisData.result);
	});
};

var uplodFileToOss = (req, res) => {
	var suffix = req.allParams.fileName.replace(/.+\./, "").toLowerCase();
	res.thisData.result.storeAs = 'userFiles/' + common.generateRandomSha256Key() + '.' + suffix;
	req.allParams.url = __config.cdn + res.thisData.result.storeAs;

	insertUserResource(req, res);
};

var checkFileRepeat = (req, res) => {
	var checkFileRepeatJson = {
		tableName: 'service.user_resource',
		field: ['url'],
		where: {
			md5: req.allParams.md5,
			status: 1
		},
		limit: 1
	};

	select(checkFileRepeatJson, (err, rows) => {
		if (err) {
			res.error('INSERT ARTICLE ERROR');
			return;
		}
		if (rows.length === 0) {
			uplodFileToOss(req, res);
			return;
		}
		req.allParams.url = rows[0].url;
		res.thisData.result.reapeat = true;
		insertUserResource(req, res);
	});
};

module.exports = (req, res, next) => {
	req.verifyParams({
		"fileName": "*",
		"md5": "*",
		"mimeType": "*"
	}, (rejected) => {
		if (rejected) {
			return;
		}
		res.thisData = {};
		res.thisData.result = {
			reapeat: false
		};
		checkFileRepeat(req, res);
	});
};
