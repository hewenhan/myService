module.exports = (req, res, next) => {
	console.log(req.allParams);
	res.success(req.allParams);
};
