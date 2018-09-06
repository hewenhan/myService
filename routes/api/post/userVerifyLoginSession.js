module.exports = (req, res, next) => {
	common.updateUserLogin(req.allParams.userInfo.id, req.headers['x-real-ip'], req.headers['user-agent']);
	res.success(req.allParams.userInfo);
};
