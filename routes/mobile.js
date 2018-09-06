var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

var initMobileTemplate = (req, res, next) => {
	res.renderOrigin = res.render;
	res.render = function (view, opt) {
		opt.hehe = 'hahah';
		opt.globalHtmlHeadTag = fs.readFileSync('template/globalHtmlHeadTag.html');
		opt.globalHtmlBodyHeadTag = fs.readFileSync('template/globalHtmlBodyHeadTag.html');
		opt.globalHtmlBodyFootTag = fs.readFileSync('template/globalHtmlBodyFootTag.html');
		res.renderOrigin(view, opt);
	}
	next();
};

var requireAuthentication = function (req, res, next) {
	if (req._parsedUrl.pathname === '/index') {
		next();
		return;
	}

	var loginTip = () => {
		res.redirect('/mobile/index?tipLogin=true');
	};

	if (req.cookies.loginSession == null) {
		loginTip();
		return;
	}
	common.getUserInfoByLoginSession(req.cookies.loginSession, (err, userInfo) => {
		if (err) {
			res.clearCookie('loginSession');
			loginTip();
			return;
		}
		if (userInfo == null) {
			res.clearCookie('loginSession');
			loginTip();
			return;
		}
		req.allParams = {};
		req.allParams.userInfo = userInfo;
		next();
	});
};

try {
	fs.mkdirSync(__dirname + '/mobile');
} catch (e) {
	
}
router.use(initMobileTemplate);
router.use(requireAuthentication);
routerFunction.createRoutePath('get', __dirname + '/mobile', router);

module.exports = router;
