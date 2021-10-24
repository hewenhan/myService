module.exports = (req, res, next) => {
	console.log("CDN AUTH HEADERS");
	console.log(req.headers);

	console.log("CDN AUTH PARAMS");
	console.log(req.allParams);
	res.success();
};
