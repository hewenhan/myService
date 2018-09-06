module.exports = (req, res, next) => {
	req.verifyParams({
		"userName": "*",
		"passwd": "*"
	}, (rejected) => {
		req.allParams.hashPasswd = crypto.createHash('sha256').update(req.allParams.passwd).digest('hex');
		var selectJson = {
			tableName: 'service.user',
			where: {
				name: req.allParams.userName,
				password: req.allParams.hashPasswd,
				status: 1
			},
			limit: 1
		};

		select(selectJson, (err, rows) => {
			if (err) {
				res.error('USER LOGIN ERROR');
				return;
			}
			if (rows.length === 0) {
				res.error('用户名或密码错误');
				return;
			}
			var userInfo = rows[0];
			delete userInfo.password;

			for (var i in userInfo) {
				if (userInfo[i] == null) {
					delete userInfo[i];
				}
			}
			common.setUserLoginSession(userInfo, (err, sessionObj) => {
				if (err) {
					console.log(`SET SESSION ERROR`);
					console.log(err);
					res.success(userInfo);
					return;
				}
				res.cookie('loginSession', sessionObj.session, { expires: new Date(Date.now() + sessionObj.expire) });
				res.success(userInfo);
			});
		});
	});
};
