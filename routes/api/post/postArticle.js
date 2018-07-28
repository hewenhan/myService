module.exports = (req, res, next) => {
	req.verifyParams({
		"title": "*",
		"content": "*"
	}, (rejected) => {
		var insertJson = {
			tableName: 'service.article',
			data: {
				title: req.allParams.title,
				content: req.allParams.content
			}
		};

		insert(insertJson, (err) => {
			if (err) {
				res.error('INSERT ARTICLE ERROR');
				return;
			}
			res.success();
		});
	});
};
