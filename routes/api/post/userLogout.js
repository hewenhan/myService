module.exports = (req, res, next) => {
	res.clearCookie('loginSession');
	common.delUserLoginSession(req.cookies.loginSession);
	res.success();
};
