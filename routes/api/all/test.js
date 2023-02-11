module.exports = (req, res, next) => {
	console.log(req);
	res.success(req.allParams);
};
