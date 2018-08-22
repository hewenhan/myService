module.exports = (req, res, next) => {
	res.success(req.allParams.userInfo);
};
