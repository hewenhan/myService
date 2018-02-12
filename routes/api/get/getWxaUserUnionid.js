var getUserUnionId = function () {
	var options = {
		url: "https://api.weixin.qq.com/sns/jscode2session",
		data: {
			grant_type: "authorization_code",
			appid: __config.wxa.appId,
			secret: __config.wxa.secret,
			js_code: req.allParams.code
		}
	};

	reqHttp(options, function (err, accessTokenObj) {
		if (err) {
			console.log(`${new Date()}: GET ACCESS_TOKEN ERROR`);
			return;
		}

		console.log(`GEN ${__config.wxa.appId} ACCESS_TOKEN SUCCESS: ${accessTokenObj.access_token}`);

		saveAccessToken(accessTokenObj.access_token);
		setTimeout(getAccessToken, accessTokenObj.expires_in * 0.8 * 1000);
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"code": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}
		getUserUnionId(req, res);
	});
};
