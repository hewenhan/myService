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


const cache = require('node-file-cache').create({
	file: './objCache.js',
	life: 31536000
});

const key = 'my-cache-key';
// const item = {
//     name: 'my cache item'
// };
// const options = {
//     life: 60,   // set lifespan of one minute
//     tags: [ 'my-cache-tag', 'another-tag' ]
// };

cache.set(key, "item");

const cachedItem = cache.get(key);

console.log(cachedItem);