var __config = require('./config/config');
var steamConifg = __config.steam;
var steamLib = require('./lib/steamLib')(steamConifg);
var reqHttp = require("request_http");

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


// redis = require('redis-pool-fns')(__config.redis);
// require("mysql-pool-crud")(__config.mysql);
// common = require('./common/publicFunction');

// common.getUserInfoByLoginSession('40s341534752985696', (err, userInfo) => {
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

// redis.delPatt('loginSession_*');

var option = {
	url: 'https://kg2.qq.com/node/play?s=P8TiHIPieBDWFPnV&shareuid=619b9a87222c35893c&topsource=a0_pn201001006_z1_u367271228_l1_t1534996455__',
	headers: {
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
	}
};

reqHttp(option, (err, data) =>  {
	console.log(err);
	console.log(data);
});
