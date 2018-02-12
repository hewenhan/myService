var checkDone = function (req, res) {
	req.thisData.getDataCount--;
	if (req.thisData.getDataCount != 0) {
		return;
	}

	res.success(req.thisData.result);
};

var getRedPackUserTotalPoint = function (req, res) {
	var getRedPackUserTotalPointSql = `
	SELECT
	SUM(get_point) AS historyPoints
	FROM uu.marketing_redpack_unlock
	WHERE unionid = '${req.allParams.unionId}' AND status = 1
	`;

	query(getRedPackUserTotalPointSql, function (err, rows) {
		if (err) {
			res.error(`getRedPackUserTotalPointError`);
			return;
		}

		if (rows.length == 0) {
			checkDone(req, res);
			return;
		}

		req.thisData.result.historyPoints = rows[0].historyPoints;
		checkDone(req, res);
	});
};

var getRedPackUserInfo = function (req, res) {
	var getRedPackUserInfoJson = {
		tableName: "uu.marketing_redpack_unlock",
		field: ['type', 'get_point'],
		where: {
			red_pack_id: req.allParams.id,
			unionid: req.allParams.unionId
		}
	};

	select(getRedPackUserInfoJson, function (err, rows) {
		if (err) {
			res.error(`getRedPackUserInfoError`);
			return;
		}

		req.thisData.result.redPackReceived = rows;
		checkDone(req, res);
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*",
		"unionId": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		req.thisData = {};

		req.thisData.result = {
			historyPoints: 0,
			redPackReceived: []
		};

		req.thisData.getDataCount = 2;

		getRedPackUserInfo(req, res);
		getRedPackUserTotalPoint(req, res);
	});
};
