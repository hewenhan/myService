
	if ((
		/？！/.test(text) ||
		/\?!/.test(text) ||
		/为什么/.test(text) ||
		/迷茫/.test(text) ||
		/彷徨/.test(text) ||
		/我操/.test(text) ||
		/卧槽/.test(text) ||
		/难受/.test(text) ||
		/祝福/.test(text) ||
		/恭喜/.test(text) ||
		/祝你/.test(text) ||
		/祝愿/.test(text) ||
		/是是是/.test(text) ||
		/祝愿/.test(text) ||
		/无聊/.test(text) ||
		/叭叭/.test(text) ||
		/哪位/.test(text) ||
		/上天/.test(text) ||
		/高雅/.test(text) ||
		text.length < 20
	)) { markTagArr.push("无关（祝福、吐槽、天气、废话、app活动）") }
	if (
		/影视/.test(text) ||
		/看剧/.test(text) ||
		/放映/.test(text) ||
		/电影/.test(text) ||
		/主演/.test(text) ||
		/追剧/.test(text)
	) { markTagArr.push("影视") }
	if (
		/曲/.test(text) ||
		/歌/.test(text)
	) { markTagArr.push("音乐舞蹈") }
	if (
		/养生/.test(text) ||
		/健康/.test(text)
	) { markTagArr.push("健康") }
	if (
		/运动/.test(text) ||
		/健身/.test(text) ||
		/跑步/.test(text) ||
		/深蹲/.test(text) ||
		/硬拉/.test(text) ||
		/卧推/.test(text) ||
		/撸铁/.test(text) ||
		/举铁/.test(text)
	) { markTagArr.push("运动健身") }
	if (
		/awsl/i.test(text) ||
		/猫/.test(text) ||
		/狗/.test(text) ||
		/虫/.test(text) ||
		/金毛/.test(text) ||
		/二哈/.test(text) ||
		/宠物/.test(text) ||
		/虐待/.test(text)
	) { markTagArr.push("动物") }
	if (
		/婴儿/.test(text)
	) { markTagArr.push("母婴育儿") }
	if (
		/运势/.test(text)
	) { markTagArr.push("星座命理") }
	if (
		/摄影/.test(text)
	) { markTagArr.push("摄影") }
	if (
		/文学/.test(text) ||
		/历史/.test(text)
	) { markTagArr.push("文学历史") }
	if (
		/汽车/.test(text) ||
		/排量/.test(text) ||
		/发动机/.test(text)
	) { markTagArr.push("汽车") }
	if (
		/家居/.test(text) ||
		/绿植/.test(text) ||
		/种植/.test(text)
	) { markTagArr.push("家居") }
	if (
		/IT科技/.test(text)
	) { markTagArr.push("IT科技") }
	if (
		/美妆护肤/.test(text) ||
		/水光/.test(text) ||
		/面膜/.test(text) ||
		/润肤/.test(text) ||
		/抗皱/.test(text) ||
		/抗衰/.test(text) ||
		/补水/.test(text) ||
		/保湿/.test(text) ||
		/控油/.test(text) ||
		/爽肤/.test(text) ||
		/化妆品/.test(text) ||
		/拉皮/.test(text) ||
		/防晒/.test(text) ||
		/暗沉/.test(text) ||
		/化妆/.test(text)
	) { markTagArr.push("美妆护肤") }
	if (
		/医美/.test(text) ||
		/水光/.test(text) ||
		/抗衰/.test(text) ||
		/拉皮/.test(text) ||
		/针/.test(text)
	) { markTagArr.push("医美") }
	if (
		/时尚潮流/.test(text)
	) { markTagArr.push("时尚潮流") }
	if (
		/职场/.test(text)
	) { markTagArr.push("职场") }
	if (
		/校园/.test(text)
	) { markTagArr.push("校园") }
	if (
		/教育/.test(text) ||
		/考试/.test(text) ||
		/考级/.test(text) ||
		/升学/.test(text) ||
		/上课/.test(text)
	) { markTagArr.push("教育") }
	if (
		/抽奖/.test(text) ||
		/中奖/.test(text) ||
		/抽中/.test(text)
	) { markTagArr.push("抽奖") }
	if (
		/旅行/.test(text) ||
		/旅游/.test(text) ||
		/游记/.test(text) ||
		/到此一游/.test(text) ||
		/打卡地/.test(text) ||
		/地点打卡/.test(text)
	) { markTagArr.push("旅行") }
	if (
		/体育/.test(text)
	) { markTagArr.push("体育") }
	if (
		/新闻/.test(text) ||
		/播报/.test(text) ||
		/公布/.test(text) ||
		/发布/.test(text) ||
		/#疫情/.test(text) ||
		/境外输入/.test(text)
	) { markTagArr.push("新闻") }
	if (
		/美食/.test(text) ||
		/好吃/.test(text) ||
		/食堂/.test(text) ||
		/没味/.test(text)
	) { markTagArr.push("美食") }
	if (
		/心灵情感/.test(text) ||
		/心灵鸡汤/.test(text) ||
		/哲理/.test(text) ||
		/情商/.test(text) ||
		/成功/.test(text)
	) { markTagArr.push("心灵情感") }
	if (
		/广告/.test(text) ||
		/#/.test(text) ||
		/链接/.test(text)
	) {
		if (
			/【￥/.test(text) ||
			/购买/.test(text) ||
			/加构/.test(text) ||
			/旗舰店/.test(text) ||
			/必买/.test(text) ||
			/访问/.test(text) ||
			/价格/.test(text) ||
			/75折/.test(text) ||
			/打折/.test(text) ||
			/抢 单/.test(text) ||
			/抢单/.test(text) ||
			/史低/.test(text)
		) {
			markTagArr.push("带货广告")
		} else {
			markTagArr.push("不带货广告")
		}
	}
	if (
		/【￥/.test(text) ||
		/购买/.test(text) ||
		/加构/.test(text) ||
		/旗舰店/.test(text) ||
		/必买/.test(text) ||
		/访问/.test(text) ||
		/价格/.test(text) ||
		/75折/.test(text) ||
		/打折/.test(text) ||
		/抢 单/.test(text) ||
		/抢单/.test(text) ||
		/史低/.test(text)
	) {
		if (markTagArr.indexOf("带货广告") != -1) {
			markTagArr.push("带货广告")
		}
	}
	if (
		/财经/.test(text) ||
		/股票/.test(text) ||
		/基金/.test(text) ||
		/投资/.test(text) ||
		/股权/.test(text) ||
		/收益/.test(text) ||
		/年化/.test(text) ||
		/月化/.test(text) ||
		/日化/.test(text) ||
		/比特币/.test(text) ||
		/以太坊/.test(text) ||
		/财报/.test(text) ||
		/市场/.test(text) ||
		/经济/.test(text) ||
		/财政/.test(text) ||
		/商机/.test(text)
	) { markTagArr.push("财经") }
	if (
		/动漫游戏/.test(text) ||
		/动漫/.test(text) ||
		/游戏/.test(text) ||
		/望着荣耀/.test(text) ||
		/上单/.test(text) ||
		/卡婊/.test(text)
	) { markTagArr.push("动漫游戏") }
	if (
		/祖国/.test(text) ||
		/国家/.test(text) ||
		/军人/.test(text) ||
		/共产/.test(text) ||
		/习大大/.test(text) ||
		/国家/.test(text)
	) { markTagArr.push("爱国") }
	if (
		/军事政治/.test(text) ||
		/军机/.test(text) ||
		/部队/.test(text) ||
		/将军/.test(text) ||
		/大将/.test(text)
	) { markTagArr.push("军事政治") }
	if (
		/名人馆/.test(text) ||
		/袁隆平/.test(text)
	) { markTagArr.push("名人馆") }
	if (
		/娱乐明星/.test(text) ||
		/代言/.test(text) ||
		/主演/.test(text) ||
		/蔡徐坤/.test(text) ||
		/王一博/.test(text)
	) { markTagArr.push("娱乐明星") }
	if (markTagArr.length == 0) {
		markTagArr.push('其它');
	}