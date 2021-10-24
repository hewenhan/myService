module.exports = (req, res, next) => {
	console.log("CDN AUTH HEADERS");
	console.log(req.headers);

	console.log("CDN AUTH PARAMS");
	console.log(req.allParams);

	var ua = req.headers['user-agent'].trim().toLowerCase();

	if (ua == "") {
		res.status(403);
		res.error("DON'T PLAY WITH ME!!");
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
	res.status(403);
	res.error("DON'T PLAY WITH ME!!");
};
