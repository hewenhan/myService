module.exports = function (req, res, next) {
	// req.verifyParams({
	// 	"id": "*"
	// }, function (rejected) {
	// 	if (rejected) {
	// 		return;
	// 	}

	// 	getRedPackDataInfo(req, res);
	// });

	console.log(req.allParams);
	res.send(req.allParams.echostr);
};
