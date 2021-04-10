const reqHttp = require("request_http");
const cheerio = require('cheerio');
const fs = require('fs');
const fns = require('../common/publicFunction');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const util = require('util');

var saveLog = function (msg) {
	if (typeof msg === 'object') {
		msg = util.inspect(msg);
	}
	var logData = `${fns.customFormatTime(new Date())}: ${msg}`;
	console.log(logData);
	// var logFile = './logs/spiderHitran.log';
	// fs.appendFile(logFile, logData + '\n', {encoding: 'utf8', flag: 'a+'}, function (err) {
	// 	if(err) {
	// 		console.log(err);
	// 	}
	// });
};

const playListArr = [
['1','Flickering','Turbo Knight & Vosto','https://static.hewenhan.me/userFiles/eb2e954be3e66873fa0fd67432eb142fbfa1c899bfff368928513dbe778cf6cf.mp3'],
['2','Celestial','Turbo Knight & Vosto','https://static.hewenhan.me/userFiles/2dd921cbc60cdb3d7061e2dd21907264e603cd9e16687a7024d4a26efed88d70.mp3'],
['3','Souyz Astronaut','Turbo Knight & Vosto & Dane Whisper','https://static.hewenhan.me/userFiles/8ddc5e6fab30cec39dbe06dde7f12bb0ac90c4ca175e22083472fffbdf4254e1.mp3'],
['4','2029','Turbo Knight & Vosto','https://static.hewenhan.me/userFiles/9f13065849fb4e2dbd057e9609f1a3906d6c76764b3d422181f906b82c317999.mp3'],
['5','Stranger Quarks','Turbo Knight & Vosto','https://static.hewenhan.me/userFiles/5aff338004616075a6530272f2023aa0109f754bc726a133ee616794666575d5.mp3'],
];

const postConfig = {
	artworkId: 584,
	coverUrl: 'https://blog.hewenhan.me/wp-content/uploads/2021/04/XiKl8XZpJ3xmO1i2-300x300.jpg'
};

const buildTrackObj = (indexNum, title, artist, audioUrl) => {
	var result = {
		artist: artist,
		artworkId: postConfig.artworkId,
		artworkUrl: postConfig.coverUrl,
		audioId: '0',
		audioUrl: audioUrl,
		format: '',
		length: '',
		title: title,
		order: indexNum,
		mp3: audioUrl,
		meta: {artist: artist, length_formatted: ''},
		src: audioUrl,
		thumb: {src: postConfig.coverUrl}
	};
	return result;
};

const trackData = {
	'post_id': '583',
	tracks: [],
	'nonce': 'e2778de40c',
	'action': 'cue_save_playlist_tracks'
};

const postPlaylist = () => {
	for (var i = 0; i < playListArr.length; i++) {
		var no = playListArr[i][0];
		var title = playListArr[i][1];
		var artist = playListArr[i][2];
		var url = playListArr[i][3];

		trackData.tracks.push(buildTrackObj(no, title, artist, url));
	}

	var options = {
		method: 'post',
		url: `https://blog.hewenhan.me/wp-admin/admin-ajax.php?_fs_blog_admin=true`,
		data: trackData,
		headers: {
			'Connection': 'keep-alive',
			'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
			'Accept': '*/*',
			'X-Requested-With': 'XMLHttpRequest',
			'sec-ch-ua-mobile': '?0',
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Origin': 'https://blog.hewenhan.me',
			'Sec-Fetch-Site': 'same-origin',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Dest': 'empty',
			'Referer': 'https://blog.hewenhan.me/wp-admin/post.php?post=532&action=edit',
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,hu;q=0.7,und;q=0.6,es;q=0.5',
			'Cookie': 'wordpress_sec_897ef85a8ea4c70983bcf6e8f38b9de0=hewenhan%7C1618653247%7CfDcMG57zHrZv92jYdVjB7Kwvt28xO1Vg6Wb3afagSWc%7C36e753c221857ac35929c4c14d478581476148e6745fb419c30a936e8b38ca70; wordpress_sec_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1619185776%7CffDPsOBTHkDWTVq2faF8E4CLZVCXJ6sz24UiKwMw2iq%7C8f0eb59c38ca07fcdd69e8791aa31a7fa48b3d57a477cf37a84c8ff07b834d90; wordpress_logged_in_897ef85a8ea4c70983bcf6e8f38b9de0=hewenhan%7C1618653247%7CfDcMG57zHrZv92jYdVjB7Kwvt28xO1Vg6Wb3afagSWc%7Cef114d731313b4e05c497df8ada091ff24038a34bf2ce1a2fd492f6768d59edc; wordpress_logged_in_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1619185776%7CffDPsOBTHkDWTVq2faF8E4CLZVCXJ6sz24UiKwMw2iq%7Cf7fb356efd6126c35d10d6938e2813f84d478a3171a149ac7fb72e619bb896a4; PHPSESSID=phm9k2rvq20raamftqd3mmajn1; Hm_lvt_37f30ee02580e891765c04f25597bc41=1617880044,1617942047,1618048524,1618049907; Hm_lpvt_37f30ee02580e891765c04f25597bc41=1618049907; Hm_lvt_880880fed08ec77c107a5711d9bfa1c9=1617880044,1617942047,1618048524,1618049907; Hm_lpvt_880880fed08ec77c107a5711d9bfa1c9=1618049907; wp-settings-time-1=1618049976; wp-settings-1=libraryContent%3Dbrowse%26editor%3Dhtml%26hidetb%3D1%26post_dfw%3Doff%26mfold%3Do%26posts_list_mode%3Dlist%26urlbutton%3Dnone'
		}
	};

	reqHttp(options, (err, string) => {
		if (err) {
			saveLog(err);
			return;
		}
		
		saveLog(`postPlaylist DONE`);
		saveLog(string);
	});
};

postPlaylist();
