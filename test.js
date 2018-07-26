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
