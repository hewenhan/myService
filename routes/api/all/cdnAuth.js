const rejectBadRequest = (req, res) => {
	res.status(403);
	res.error("DON'T PLAY WITH ME!!");
	console.log("BED CDN REQUEST ERROR");
	console.log("CDN AUTH HEADERS");
	console.log(req.headers);
	console.log("CDN AUTH PARAMS");
	console.log(req.allParams);
};

module.exports = (req, res, next) => {

	var ua = req.headers['user-agent'].trim().toLowerCase();
	console.log(ua);

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
	if (/yisouspider/g.test(ua)) {
		res.success();
		return;
	}
	if (/googlebot/g.test(ua)) {
		res.success();
		return;
	}
        if (/curl/g.test(ua)) {
                res.success();
                return;
        }
        if (/vlc/g.test(ua)) {
                res.success();
                return;
        }
        if (/twitterbot/g.test(ua)) {
                res.success();
                return;
        }
	

	rejectBadRequest(req, res);
};
