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
['01', 'Introduction', 'Magnavolt', 'https://static.hewenhan.me/userFiles/10a51003bcde9bfea0ba59b595fe801bac40aefde48adca7ca3c897d83460d57.mp3'],
['02', 'City Ruins', 'Magnavolt', 'https://static.hewenhan.me/userFiles/e0f7416ac970efab53f44069159e4ac29bad3e9d8e458f6ada0324bb3e1e2d0f.mp3'],
['03', 'Riot', 'Magnavolt', 'https://static.hewenhan.me/userFiles/ca8b177cef5ce3df7b85e08b1bd67856ca83295d9a971950410ffecb6e5400ed.mp3'],
['04', 'Mirai', 'Magnavolt', 'https://static.hewenhan.me/userFiles/e10cd026ee96d541edad25ecae5662865d7cac115b936e59fc4ded84b98fd0aa.mp3'],
['05', 'Seishin', 'Magnavolt', 'https://static.hewenhan.me/userFiles/cc5c0d3449ff384c99d9b808a2155c5ccc8f67eb6a4e2a39d753fe821c4875fb.mp3'],
['06', 'The Club', 'Magnavolt', 'https://static.hewenhan.me/userFiles/13d16b982a2bece6ae31f97dbd69343c128aaeb6ac7d6812c17f2f4afc8d0fbd.mp3'],
['07', 'Techno Orgasm', 'Magnavolt', 'https://static.hewenhan.me/userFiles/0426a8dcf0e029209be9514279998bd3dc8c2e963b7ac881dde38b2db07477c2.mp3'],
['08', 'VIP Only', 'Magnavolt', 'https://static.hewenhan.me/userFiles/f4835c39ab1ad46c19323737785d19fce2d707b00bc2007cbb9f02381c6ec872.mp3'],
['09', 'Rotten Flesh', 'Magnavolt', 'https://static.hewenhan.me/userFiles/3f99fb288c49676479387fd45b8f9d0acb3d7cd305ffbf1c950141b1266d2f98.mp3'],
['10', 'Kronos Lab', 'Magnavolt', 'https://static.hewenhan.me/userFiles/b5e8c20f3abd28fbfa886d7f77b73b13cba44768f74ef750dfd8ab6d7955d3ca.mp3'],
['11', 'Ero', 'Magnavolt', 'https://static.hewenhan.me/userFiles/750822539f5df99ce00dab3635a2c81896358642f5710e02c833d60326b0f30d.mp3'],
['12', 'Painkillers', 'Magnavolt', 'https://static.hewenhan.me/userFiles/7f425f1c2e71a44032e13406e8dd55a4a1a0c11fa7cdb358e7562508cabd31ac.mp3'],
['13', 'Faceless Man', 'Magnavolt', 'https://static.hewenhan.me/userFiles/b3e053f9ca2798d7b0548e04a25f70714964a2d0073d1eb654ace9ebcdaaf630.mp3'],
['14', 'Till the end', 'Magnavolt', 'https://static.hewenhan.me/userFiles/e0063ea405b0fa3acd2d3161d7d89d4dfa28114167332c32afbf5299c3d1d863.mp3'],
['15', 'Jiyuu', 'Magnavolt', 'https://static.hewenhan.me/userFiles/6e074ed817730ac89e8d6a9e6aa63dd1bdd84a327daa0abf374bb928aeb80ecb.mp3']
];

const postConfig = {
	artworkId: 907,
	coverUrl: 'https://blog.hewenhan.me/wp-content/uploads/2021/05/zoJhSQp1aqCnG_8b-300x300.jpg'
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
	'post_id': '906',
	tracks: [],
	'nonce': '39d75080b1',
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
			'Cookie': 'wordpress_sec_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1622102473%7CJALwm3U9Ez0GlOn4eFjeKdzGMbRo3e2qrGRVUuf7h91%7C95ca9e4854ad5e1ea80c89328849cdb3ab7de46a627e64d06d40a014cee97aa8; Hm_lvt_880880fed08ec77c107a5711d9bfa1c9=1618164152,1618164343,1618164488,1618164506; wordpress_logged_in_d7f3078bf68ac0df50c4030b830c2a4f=hewenhan%7C1622102473%7CJALwm3U9Ez0GlOn4eFjeKdzGMbRo3e2qrGRVUuf7h91%7C5347ec508d47b2422813e0e907e8c8766f362f4875f559a499cfce8dc72d266e; PHPSESSID=vrl6le6gsvcnjunpakn1m7c2d6; Hm_lvt_37f30ee02580e891765c04f25597bc41=1619745399,1620637908,1620892860,1621093902; Hm_lpvt_37f30ee02580e891765c04f25597bc41=1621093902; wp-settings-time-1=1621094176; wp-settings-1=libraryContent%3Dbrowse%26editor%3Dhtml%26hidetb%3D0%26post_dfw%3Doff%26mfold%3Do%26posts_list_mode%3Dlist%26urlbutton%3Dnone'
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
