var reqHttp = require("request_http");

var languageJson = {
	bulgarian: "保加利亚语",
	czech: "捷克语",
	danish: "丹麦语",
	dutch: "荷兰语",
	english: "英语",
	finnish: "芬兰语",
	french: "法语",
	greek: "希腊语",
	german: "德语",
	hungarian: "匈牙利语",
	italian: "意大利语",
	japanese: "日语",
	koreana: "韩语",
	norwegian: "挪威语",
	polish: "波兰语",
	portuguese: "葡萄牙语",
	brazilian: "葡萄牙语-巴西",
	russian: "俄语",
	romanian: "罗马尼亚语",
	schinese: "简体中文",
	spanish: "西班牙语",
	swedish: "瑞典语",
	tchinese: "繁体中文",
	thai: "泰语",
	turkish: "土耳其语",
	ukrainian: "乌克兰语"
}

var steamLib = function (steamConfig) {
	if (steamConfig == null) {
		throw "CONFIG ERROR";
	}
	if (steamConfig.apiKey == null) {
		throw "APIKEY IS NULL";
	}

	this.host = "https://api.steampowered.com";
	this.apiKey = steamConfig.apiKey;
	this.format = steamConfig.format || "json";

	return this;
};

steamLib.prototype.apiRequest = function (interface, method, version, paramsObj, callback) {
	var self = this;
	var options = {
		url: `${self.host}/${interface}/${method}/v${version}/`,
		data: {
			key: self.apiKey
		}
	};

	for (var i in paramsObj) {
		options.data[i] = paramsObj[i]
	}

	// console.log(options);

	reqHttp(options, callback);
};

steamLib.prototype.getPlayerSummaries = function (steamId, callback) {
	var self = this;
	var interface = "ISteamUser";
	var method = "GetPlayerSummaries";
	var version = "2";
	var paramsObj = {
		steamids: steamId
	};

	self.apiRequest(interface, method, version, paramsObj, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		callback(null, data.response);
	});
};

steamLib.prototype.getOwnedGames = function (steamId, callback) {
	var self = this;
	var interface = "IPlayerService";
	var method = "GetOwnedGames";
	var version = "1";
	var paramsObj = {
		steamid: steamId
	};

	self.apiRequest(interface, method, version, paramsObj, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		callback(null, data.response);
	});
};

steamLib.prototype.getSchemaForGame = function (appid, language, callback) {
	var self = this;
	var interface = "ISteamUserStats";
	var method = "GetSchemaForGame";
	var version = "2";
	var paramsObj = {
		appid: appid,
		l: language || "english",
	};

	self.apiRequest(interface, method, version, paramsObj, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		callback(null, data);
	});

};

module.exports = function (steamConfig) {
	return new steamLib(steamConfig);
};