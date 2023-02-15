const openAI = require('../../../lib/openAI')(__config.openAI, redis);

// {
// 	signature: '8957524acb8bdd41de6b3da3ec183f77dc7528c9',
// 	timestamp: '1676090261',
// 	nonce: '1306894723',
// 	openid: 'oj-kewBhPkAf7H0ACPSQfOB8icFQ',
// 	encrypt_type: 'aes',
// 	msg_signature: '8ebcd9da952dbf381d77ffd5686a26fc183fe4b0',
// 	xml: {
// 	  tousername: [ 'gh_5767f12effd8' ],
// 	  fromusername: [ 'oj-kewBhPkAf7H0ACPSQfOB8icFQ' ],
// 	  createtime: [ '1676090261' ],
// 	  msgtype: [ 'text' ],
// 	  content: [ '哪尼' ],
// 	  msgid: [ '23995844246158604' ],
// 	  encrypt: [
// 		'HjH7NevfpaRTahdCCdlXQWNCsdXFLG36+t/zbjTwXFiYJ/eOBrlLOzxX6Etp+AvJLZgdxdo0HNOfD8LiGYeCkaljKQK89Ip8T5hHXVaE0t8ZjgMHaKNRja4muFYVWZ4mxKL7odbZss6g0mlonVSLN2hxmmSkS1n6CfYGKxOd6gFbsEGI8g/4h8JPeshkYIeHinlM8TE7+p1lcFvsDKUTmDx/PYz/6KYvNSPGqREjp97lnqCsRpQmx66tK2XhXoXTLDFkJwFrPmmhVDKY5fXbchdYLrHIlQfrsACCsS4VokQw/X6hkX93j8XpDOCBdhbO85uR7pxDVUvXGKx6cazxvu7B/4Ov0OXXsMZUx568doexS4tyTGjO2XSqGFR2fIcfdttqnJtvmTn4zIEYyda7oktYsda8MiPDGdOY5jESaHo='
// 	  ]
// 	}
//   }

const checkSeqMsgAndSend = (res, msgObj) => {
	console.log('checkSeqMsgAndSend!!!!!!!');
	setTimeout(() => {
		console.log(res.statusCode);
		redis.get(msgObj.msgid, (err, reply) => {
			if (err) {
				console.log(err);
				return;
			}
			if (reply != null) {
				var reciveMsg = `
					<xml>
						<ToUserName><![CDATA[${msgObj.fromUser}]]></ToUserName>
						<FromUserName><![CDATA[${msgObj.toUser}]]></FromUserName>
						<CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
						<MsgType><![CDATA[text]]></MsgType>
						<Content><![CDATA[${reply}]]></Content>
					</xml>`;
				res.send(reciveMsg);
				return;
			}
			checkSeqMsgAndSend(res, msgObj);
		});
	}, 1000);
};
module.exports = function (req, res, next) {
	console.log(req.allParams);

	if (req.allParams.echostr != null) {
		res.send(req.allParams.echostr);
		return;
	}

	var msgObj = {
		fromUser: req.allParams.xml.fromusername[0],
		toUser: req.allParams.xml.tousername[0],
		msgid: req.allParams.xml.msgid[0],
		content: ''
	};

	openAI.ask(req.allParams.xml.content[0], msgObj.msgid);
	checkSeqMsgAndSend(res, msgObj);

	console.log(reciveMsg);

	// res.send('success');
};
