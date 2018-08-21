var __config = require('./config/config');
var steamConifg = __config.steam;
var steamLib = require('./lib/steamLib')(steamConifg);

/*
steamLib.getPlayerSummaries("76561198015962791", function (err, data) {
	if (err) {
		console.log(err);
		return;
	}

	console.log(data);
});

steamLib.getOwnedGames("76561198015962791", function (err, data) {
	if (err) {
		console.log(err);
		return;
	}

	console.log(data);
});
*/

// steamLib.getOwnedGames("76561198015962791", function (err, data) {
// 	if (err) {
// 		console.log(err);
// 		return;
// 	}

// 	console.log(data);
// });


// steamLib.getSchemaForGame(data.games[i].appid, null, function (err, gameInfo) {
// 	if (err) {
// 		console.log(err);
// 		return;
// 	}

// 	console.log(gameInfo);
// });


redis = require('redis-pool-fns')(__config.redis);
require("mysql-pool-crud")(__config.mysql);
common = require('./common/publicFunction');

// common.getUseteLoginSession('40s341534752985696', (err, userInfo) => {
// 	if (err) {
// 		console.log(err);
// 		return;
// 	}
// 	if (userInfo == null) {
// 		console.log('SESSION EXPIRED');
// 		return;
// 	}
// 	console.log(userInfo);
// });

redis.delPatt('loginSession_*');
