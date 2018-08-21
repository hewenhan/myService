module.exports = (req, res, next) => {
	if (req.cookies.loginSession == null) {
		res.error('session key empty or expired');
		return;
	}
	common.getUseteLoginSession(req.cookies.loginSession, (err, userInfo) => {
		if (err) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		if (userInfo == null) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		res.success(userInfo);
	});
};
