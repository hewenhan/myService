var setRedPackStatus = function (req, res) {
	var updateRedPackDataJson = {
		tableName: "uu.marketing_redpack",
		data: {
			status: req.allParams.status
		},
		where: {
			id: req.allParams.id
		}
	};

	update(updateRedPackDataJson, function (err, result) {
		if (err) {
			res.error("setRedPackStatusError");
			return;
		}
		res.success();
	});
};


module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*",
		"status": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		setRedPackStatus(req, res);
	});
};
