var checkYyUnionid = function (req, res) {
	var insertOrUpdateJson = {
		tableName: 'uu.user_center_info',
		data: {
			openid: req.thisData.openid,
			unionid: req.thisData.unionid
		},
		uniqueFieldName: ['unionid']
	};

	insertOrUpdate(insertOrUpdateJson, function (err, results) {
		if (err) {
			res.error(`checkYyUnionidError`);
			return;
		}

		res.success(req.thisData);
	});
};

var checkYcUnionid = function (req, res) {
	var options = {
		url: "http://paycenter.cpo2o.com/1.0/yc/user/verifyauth",
		data: {
			openid: req.thisData.openid,
			unionid: req.thisData.unionid,
			user_from: 1
		}
	};

	reqHttp(options, function (err, data) {
		if (err) {
			console.log(err);
			res.error(`checkYyUnionidError`);
			return;
		}

		if (data.code != 0) {
			console.log(data);
			res.error(`checkYyUnionidError`);
			return;
		}

		res.success(req.thisData);
	});
};

var wxaUserInfoSignIn = function (req, res) {
	var options = {
		url: "https://api.weixin.qq.com/sns/jscode2session",
		data: {
			appid: __config.wxa.appId,
			secret: __config.wxa.secret,
			js_code: req.allParams.jsCode,
			grant_type: "authorization_code"
		}
	};

	reqHttp(options, function (err, json) {
		if (err) {
			res.error(`wxaUserInfoSignInError`);
			return;
		}

		if (json.errcode != null) {
			res.error(json.errmsg);
			return;
		}

		req.thisData = json;

		console.log(json);

		if (req.allParams.identity == 'yy') {
			checkYyUnionid(req, res);
		}
		if (req.allParams.identity == 'yc') {
			checkYcUnionid(req, res);
		}
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*",
		"jsCode": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		wxaUserInfoSignIn(req, res);

		var checkIdentityJson = {
			tableName: "uu.marketing_redpack",
			field: ['identity'],
			where: {
				id: req.allParams.id
			}
		};

		select(checkIdentityJson, function (err, rows) {
			if (err) {
				res.error(`checkIdentityError`);
				return;
			}
			if (rows.length == 0) {
				res.error(`checkIdEmpty`);
				return;
			}
			if (rows[0].identity == "yy" || rows[0].identity == "yc") {
				req.allParams.identity = rows[0].identity;
				wxaUserInfoSignIn(req, res);
				return;
			}
			res.error(`PARAMS identity UNKNOW`);
			return;
		});
	});
};
