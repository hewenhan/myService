var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

var requireAuthentication = function (req, res, next) {
	next();
};

try {
	fs.mkdirSync(__dirname + '/mobile');
} catch (e) {
	
}
router.all('*', requireAuthentication);
routerFunction.createRoutePath('get', __dirname + '/mobile', router);

module.exports = router;
