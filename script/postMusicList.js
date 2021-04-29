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
['01', '地道战叙事曲 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/a5858ed0bdc8e1c2684cbf9525feff0608f62be3fd863040b66fdb3dae3736d1'],
['02', '猪八戒背媳妇 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/ce7295a886b9add64a8d33566967efe47b481066422a16661a833341b50dfb1b'],
['03', '秦腔牌子曲 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/ca3d57c8d63883e77e639c6e6eecad182b5e938d93fbed4c53256197e1149fe7'],
['04', '大起板 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/4bae232844094994000cd987506f59283ae7ecf57ccd14779091a1325d6b544f'],
['05', '舟山渔歌 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/ff1c7df4b0d373e4f6c9bfe804339d3f82c92bab394e7c43fe996d12c91875a8'],
['06', '翻身道情 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/5aa4874f98f2d3f103670ebf947d28c77c0a61bbe9679004f2c38dba33ee3e88'],
['07', '云雀 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/5d6576a018f8a85cfba388f610c12cd231f515f2976e4a9fe9fa40dbeb3fe67b'],
['08', '山东小曲 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/ce84059d354c5d19127013e7f7310924ed023a0e71c974a2028fc30ba401aeb2'],
['09', '红军哥哥回来了 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/bf1da323b0edd817bc01a3e2af13ed90ec98d4292d6982dad31f5711c75f48dc'],
['10', '锄禾曲 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/67d57d9a57c83f07a306cb5c2f7e6ec0e252319ffbb5f2a372b5c4a1e648fbb5'],
['11', '三个和尚 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/c74780e6c9d52ea137480e0ad9677cd4a24655c50e5867dccd7fe63b86733e85'],
['12', '大姑娘美 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/8024051c69081cbf6edd2cc3dfb613aa4d8c45a8a491395d0ef495ddd83dfdfd'],
['13', '翻身的日子 (板胡独奏)', '沈立良', 'https://static.hewenhan.me/userFiles/68136f0fcf60e84854442cd3c6c3c9e15a074f44eaeffd22903a7397b8a69b70']
];

const postConfig = {
	artworkId: 890,
	coverUrl: 'https://blog.hewenhan.me/wp-content/uploads/2021/04/cover-225x225.jpeg'
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
	'post_id': '889',
	tracks: [],
	'nonce': '1377d5d950',
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
			'Cookie': 'wordpress_sec_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1620414826%7CPClNShPM5Fe2PUDEAj01gKDhyr922zmi4S6iLpMR5rO%7C51ea2aa54e8ee0abfa7c598a0d0218a9524542b034580c2e9c70c5fcf6d06a67; Hm_lvt_880880fed08ec77c107a5711d9bfa1c9=1618164152,1618164343,1618164488,1618164506; wordpress_logged_in_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1620414826%7CPClNShPM5Fe2PUDEAj01gKDhyr922zmi4S6iLpMR5rO%7C9abb006a513d6bcaac381cafa12f8cc63bc6450eb7c0af8609c765e73bf8c36f; PHPSESSID=3onqc74e0p7sceuvluvg8q6b92; Hm_lvt_37f30ee02580e891765c04f25597bc41=1619196696,1619205203,1619243014,1619287741; Hm_lpvt_37f30ee02580e891765c04f25597bc41=1619287741; wp-settings-time-1=1619287779; wp-settings-1=libraryContent%3Dbrowse%26editor%3Dhtml%26hidetb%3D0%26post_dfw%3Doff%26mfold%3Do%26posts_list_mode%3Dlist%26urlbutton%3Dnone'
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
