const { Configuration, OpenAIApi } = require("openai");

class OpenAILib {
	openai = null;
	redis = null;
	openAiConfig = null;

	constructor(openAiConfig, redis) {
		this.openAiConfig = openAiConfig;
		console.log(openAiConfig.apiKey);
		const configuration = new Configuration({
			apiKey: openAiConfig.apiKey
		});
		this.openai = new OpenAIApi(configuration);
		this.redis = redis;
	}

	ask = async (text, seqStr, resample) => {
		if (resample == null) {
			resample = 0;
			if (text.match(/[\.\?\!。？！]$/) == null) {
				text += '。';
			}
		}
		var res = await this.openai.createCompletion({
			model: this.openAiConfig.models[this.openAiConfig.modelIdx],
			prompt: text,
			temperature: 0.5,
			max_tokens: 400,
			top_p: 1,
			frequency_penalty: 1,
			presence_penalty: 1,
		});

		if (res.data.choices.length == 0) {
			console.log("No answer");
			return;
		}

		if (res.data.choices[0].finish_reason == "length") {
			var askText = res.data.choices[0].text;
			if (resample) {
				askText = text + askText;
			}
			resample++;
			if (resample >= 4) {
				console.log("Resample too many times, stop");
				console.log(askText);
				if (seqStr) {
					console.log(res.data);
					this.redis.set(seqStr, askText, 60);
				}
				return;
			}
			console.log(`resample ${resample} times: ${askText}`);
			this.ask(askText, seqStr, resample);
			return;
		}

		var answer = res.data.choices[0].text;
		if (resample) {
			answer = text + answer;
		}
		console.log('OpenAI answer:');
		// 把 answer trim 一下，去掉开头的空格和结尾的换行符
		answer = answer.trim();
		
		console.log(answer);

		if (seqStr) {
			this.redis.set(seqStr, answer, 60);
		}
	};
}

module.exports = function (openAiConfig, redis) {
	return new OpenAILib(openAiConfig, redis);
};
