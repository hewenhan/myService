const reqHttp = require("request_http");
Array.prototype.shuffle = function() {
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
		return this;
};
var sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

var taskId        = "1478685314468978688";
var subTaskId     = "1478685494828265472";
var subUserTaskId = "1478715765736775680";
var intInstId     = "f6e5c058";
var headers       = {
	cookie: 'cna=lo2OGa/UJycCAbRv0dRHYFTt; _uab_collina=163825146110220571366767; _umdata=G9486E7E15AC225E0AD919D45F784DAD82CDF3A; _bl_uid=e0kt7w20l5jo1wn6U3OtvyO1LhXg; bs_n_lang=zh_CN; currentRegionId=cn-shanghai; aliyun_choice=CN; aliyun_lang=zh; aliyun_country=CN; aliyun_site=CN; _samesite_flag_=true; login_aliyunid_csrf=5caffb3f709941d88a98046c46296f46; login_aliyunid="hewenhan @ 1526848644184395"; login_aliyunid_ticket=I0QvIGrZMIDUgthonsHLO3Fl6DJ9AR8pS_2xQsF9XEofq1S1E2ml6JYlY4q9CyLstMknfiSc2GhOwNcWzj5bYLpKzKZ49O80KpzxYXWJ0WPzFXDzr7rhZ_Dua5Qyv2KMv85szYAdhP4$; login_aliyunid_sc=74u48x24xL7xCj1SQ9*cYL0T_GM6j755vZLhsAgk7oO6RdsfIP5X7PnI9KLm86tC56CirX_*9VBpfkTFdJTd58u2JLtZ4RT1Mn1pgA2qaszrmJK*H1vT5ERPp2356A*R; FECS-XSRF-TOKEN=L8tDNnzH; c_token=d9273dcab5902abeb81b975fd2d4478e; ck2=33bd7ee8707adf96e338bbaa8d79c12d; an=hewenhan; lg=true; sg=n23; bd=s0ouCmI%3D; lvc=sAtlv9gBc9IRdw%3D%3D; tfstk=cs71ByNMbQvelHEq71NEgiUQYGplZKlWGl9G1iDZo3XqJTf1ib0yFLVcmxL2MB1..; l=eBNg6AoHgYs5NImABO5ahurza77O2IOb8sPzaNbMiInca6sPbF6yoNCpFJo6Ldtjgt1X3etrj4KKARCdBH50X2MRLeh3j3-rnxf..; isg=BJCQaAxTxcbNiZlS_pjYrYgBYdfiWXSjwCIDrYpgFOu-xTFvMmk3M4OznY0lFSx7'
};
var reqBaseParams = {
	product  : 'itag',
	sec_token: 'nvUT5r29x09n11EV4NIf21',
	umid     : 'Y2034a62f6e8d9bc83e814ae2a1ee9174',
	region   : 'cn-shanghai'
};

var matchTag = (text) => {
	var markTagArr = [];
	if (
		/面部护肤/.test(text) ||
		/护肤/.test(text) ||
		/面膜/.test(text) ||
		/黑头/.test(text) ||
		/脸油/.test(text) ||
		/敏感肌/.test(text) ||
		/晚霜/.test(text) ||
		/洁面/.test(text) ||
		/精华油/.test(text) ||
		/乳霜/.test(text) ||
		/补水/.test(text) ||
		/干皮/.test(text)
	) { markTagArr.push("面部护肤") }
	if (
		/身体护肤/.test(text) ||
		/护肤/.test(text) ||
		/敏感肌/.test(text) ||
		/精华油/.test(text) ||
		/护手霜/.test(text) ||
		/身体磨砂/.test(text) ||
		/沐浴油/.test(text)
	) { markTagArr.push("身体护肤") }
	if (
		/防晒隔离/.test(text) ||
		/防晒隔离/.test(text)
	) { markTagArr.push("防晒隔离") }
	if (
		/眼妆/.test(text) ||
		/美瞳/.test(text) ||
		/Fomomy/.test(text) ||
		/睫毛/.test(text) ||
		/眼影/.test(text)
	) { markTagArr.push("眼妆") }
	if (
		/底妆/.test(text) ||
		/粉底液/.test(text) ||
		/遮瑕盘/.test(text) ||
		/妆前乳/.test(text)
	) { markTagArr.push("底妆") }
	if (
		/唇妆/.test(text) ||
		/唇釉/.test(text) ||
		/唇蜜/.test(text) ||
		/口红/.test(text)
	) { markTagArr.push("唇妆") }
	if (
		/修容/.test(text) ||
		/腮红/.test(text)
	) { markTagArr.push("修容") }
	if (
		/化妆工具/.test(text) ||
		/卸妆膏/.test(text)
	) { markTagArr.push("化妆工具") }
	if (
		/美发护发/.test(text) ||
		/发色/.test(text) ||
		/发根/.test(text) ||
		/发质/.test(text)
	) { markTagArr.push("美发护发") }
	if (
		/美甲/.test(text) ||
		/美甲/.test(text)
	) { markTagArr.push("美甲") }
	if (
		/香水/.test(text) ||
		/香氛/.test(text)
	) { markTagArr.push("香水") }
	if (
		/其它/.test(text) ||
		/其它/.test(text)
	) { markTagArr.push("其它") }
	if (
		/吐槽/.test(text) ||
		/吐槽/.test(text)
	) { markTagArr.push("吐槽") }
	if (markTagArr.length == 0) {
		markTagArr.push('错误');
	}
	return markTagArr;
};
var reqList = () => {
	var taskObj = {
		TaskId: taskId,
		TntInstId: intInstId,
		WorkNode: "MARK",
		SubUserTaskId: subUserTaskId,
		ItemState: []
	};
	var reqObj = {
		url: 'https://pai.console.aliyun.com/data/api.json',
		method: 'post',
		data: reqBaseParams,
		headers: headers
	};
	reqObj.data.action = 'QueryMarkableSubTask';
	reqObj.data.content = JSON.stringify(taskObj)
	reqHttp(reqObj, (err, results) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(results);
		var subTaskId     = results.data.Result.SubTask.SubTaskId;
		var userSubTaskId = results.data.Result.SubUserTask.UserSubTaskId;
		var markList      = results.data.Result.MarkItemList;
		var tagObjList    = results.data.Result.OptionTemplate.QuestionConfigs[0].Options;
		var tagList       = [];
		for (var i = 0; i < tagObjList.length; i++) {
			tagList.push(tagObjList[i].Label);
		}

		for (var i = 0; i < markList.length; i++) {
			tagList.shuffle();

			var markTagArr   = [];
			var markItem     = markList[i];
			var markResultId = markItem.MarkResultList[0].UserMarkResultId;
			var version      = markItem.MarkResultList[0].Version;
			var questionId   = markItem.MarkResultList[0].QuestionId;
			var text         = markItem.DataMeta.source;

			var markTagArr   = matchTag(text);

			// var markTagArr = tagList.slice(0, Math.floor(Math.random() * 3) + 1)
			markTag(subTaskId, userSubTaskId, markResultId, version, questionId, markTagArr, i * 50, text);
		}
	});
};

var markTag = (subTaskId, userSubTaskId, markResultId, version, questionId, markTagArr, ms, text) => {
	setTimeout(() => {
		var taskObj = {
			TntInstId: intInstId,
			TaskId: taskId,
			SubTaskId: subTaskId,
			UserSubTaskId: userSubTaskId,
			Version: new Date().getTime(),
			MarkResult:[{
				MarkResultId: markResultId,
				QuestionId: questionId,
				MarkResult: JSON.stringify(markTagArr)
			}]
		};
		var reqObj = {
			url: 'https://pai.console.aliyun.com/data/api.json',
			method: 'post',
			data: reqBaseParams,
			headers: headers
		};
		reqObj.data.action = 'UpdateMarkResult';
		reqObj.data.content = JSON.stringify(taskObj)
		// console.log(text)
		// console.log(taskObj)
		reqHttp(reqObj, (err, results) => {
			if (err) {
				console.log(err);
				return;
			}
			// console.log(results);
		});
	}, ms);
};

reqList();
