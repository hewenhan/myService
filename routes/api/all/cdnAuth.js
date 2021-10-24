const rejectBadRequest = (req, res) => {
	res.status(403);
	res.error("DON'T PLAY WITH ME!!");
	console.log("BED CDN REQUEST ERROR");
};

module.exports = (req, res, next) => {
	console.log("CDN AUTH HEADERS");
	console.log(req.headers);

	console.log("CDN AUTH PARAMS");
	console.log(req.allParams);

	var ua = req.headers['user-agent'].trim().toLowerCase();

	if (ua == "") {
		rejectBadRequest(req, res);
		return;
	}
	if (/linux/g.test(ua)) {
		res.success();
		return;
	}
	if (/chromium/g.test(ua)) {
		res.success();
		return;
	}
	if (/mozilla/g.test(ua)) {
		res.success();
		return;
	}
	if (/safari/g.test(ua)) {
		res.success();
		return;
	}
	rejectBadRequest(req, res);
};
