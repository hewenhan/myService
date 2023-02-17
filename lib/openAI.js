const { Configuration, OpenAIApi } = require("openai");

class OpenAILib {
	openai = null;
	redis = null;
	openAiConfig = null;

	constructor(openAiConfig, redis) {
		this.openAiConfig = openAiConfig;
		const configuration = new Configuration({
			apiKey: openAiConfig.apiKey
		});
		this.openai = new OpenAIApi(configuration);
		this.redis = redis;
	}

	getUserSession = async (userId) => {
		this.redis.get(`openai-user:${userId}`, (err, reply) => {
			if (err) {
				return '';
			}
			if (reply) {
				console.log('reply');
				console.log(reply);
				return reply;
			}
			return '';
		});
	};

	appendUserSession = async (userId, text) => {
		var session = await this.getUserSession(userId);
		console.log('session');
		console.log(session);
		console.log('text');
		console.log(text);
		session += text;
		this.redis.set(`openai-user:${userId}`, session, 86400);
	};

	ask = async (text, seqStr, resample, completionModel) => {
		if (resample == null) {
			resample = 0;
			if (text[text.length - 1].match(/[\.\?\!。？！]$/) == null) {
				text += '。';
			}
		}

		if (completionModel == null) {
			completionModel = this.openAiConfig.models[this.openAiConfig.modelIdx];
		}

		var resReqObj = {
			model: completionModel,
			prompt: text,
			temperature: 0.5,
			max_tokens: 400,
			top_p: 1,
			frequency_penalty: 1,
			presence_penalty: 1,
		};
		console.log('resReqObj:');
		console.log(resReqObj);
		var res = await this.openai.createCompletion(resReqObj);

		if (res.data.choices.length == 0) {
			console.log("No answer");
			return '';
		}

		if (res.data.choices[0].finish_reason == "length") {
			var askText = res.data.choices[0].text;
			if (resample) {
				askText = text + askText;
			}
			resample++;
			if (resample >= 2) {
				console.log("Resample too many times, stop");
				console.log(askText);
				if (seqStr) {
					console.log(res.data);
					this.redis.set(seqStr, askText + `\n\n该回复使用模型：${completionModel}`, 60);
				}
				return seqStr;
			}
			console.log(`resample ${resample} times: ${askText}`);
			return this.ask(askText, seqStr, resample, completionModel);
		}

		var answer = res.data.choices[0].text;
		if (resample) {
			answer = text + answer;
		}

		if (seqStr) {
			this.redis.set(seqStr, answer.trim() + `\n\n该回复使用模型：${completionModel}`, 60);
		}

		console.log('OpenAI answer:');
		console.log(answer);

		return answer;
	};

	userAsk = async (userId, text, seqStr) => {
		var session = await this.getUserSession(userId);
		text = session + '\n\n' + text;
		var answer = this.ask(text, seqStr);

		this.appendUserSession(userId, answer);
		return answer;
	};
}

module.exports = function (openAiConfig, redis) {
	return new OpenAILib(openAiConfig, redis);
};
