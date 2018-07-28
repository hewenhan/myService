var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

var requireAuthentication = function (req, res, next) {
	res.renderOrigin = res.render;
	res.render = function (view, opt) {
		opt.hehe = 'hahah';
		opt.globalHtmlHeadTag = fs.readFileSync('template/globalHtmlHeadTag.html');
		opt.globalHtmlBodyHeadTag = fs.readFileSync('template/globalHtmlBodyHeadTag.html');;
		opt.globalHtmlBodyFootTag = fs.readFileSync('template/globalHtmlBodyFootTag.html');;
		res.renderOrigin(view, opt);
	}
	next();
};

try {
	fs.mkdirSync(__dirname + '/mobile');
} catch (e) {
	
}
router.all('*', requireAuthentication);
routerFunction.createRoutePath('get', __dirname + '/mobile', router);

module.exports = router;
