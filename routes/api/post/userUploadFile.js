const toStream = require('buffer-to-stream');

var insertUserResource = (req, res) => {
	var insertUserResourceJson = {
		tableName: 'service.user_resource',
		data: {
			uid: req.allParams.userInfo.id,
			filename: req.files.fileUpload.name,
			mimetype: req.files.fileUpload.mimetype,
			url: req.allParams.url,
			md5: req.files.fileUpload.md5,
			status: 1
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
	var fileStream = toStream(req.files.fileUpload.data);
	var suffix = req.files.fileUpload.name.replace(/.+\./, "").toLowerCase();

	common.uploader(fileStream, suffix, __config.cdn, (err, ossUrl) => {
		if (err) {
			res.error(err);
			return;
		}
		req.allParams.url = ossUrl;
		insertUserResource(req, res);
	});
};

var checkFileRepeat = (req, res) => {
	var checkFileRepeatJson = {
		tableName: 'service.user_resource',
		field: ['url'],
		where: {
			md5: req.files.fileUpload.md5
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
		insertUserResource(req, res);
	});
};

module.exports = (req, res, next) => {

	if (req.files == null) {
		res.error('params error');
		return;
	}

	if (req.files.fileUpload == null) {
		res.error('params error');
		return;
	}
	
	res.thisData = {};
	res.thisData.result = {};

	console.log(req.files.fileUpload);
	checkFileRepeat(req, res);
};
