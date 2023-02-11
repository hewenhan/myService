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

module.exports = function (req, res, next) {

	console.log(req.allParams);

	if (req.allParams.echostr != null) {
		res.send(req.allParams.echostr);
		return;
	}

	var toUser = req.allParams.xml.tousername[0];
	var fromUser = req.allParams.xml.fromusername[0];
	var content = common.randomString(10);

	var reciveMsg = `<xml>
	<ToUserName><![CDATA[${toUser}]]></ToUserName>
	<FromUserName><![CDATA[${fromUser}]]></FromUserName>
	<CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
	<MsgType><![CDATA[text]]></MsgType>
	<Content><![CDATA[确认收到，自动发送：${content}]]></Content>
</xml>`;

	// res.send('success');
	res.send(reciveMsg);
};
