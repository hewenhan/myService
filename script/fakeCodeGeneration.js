const variableList = require('./variableList');
const fs = require('fs');

const codeStruct = [
	"Require",
	"Variable",
	"Condition",
	"Comment",
	"EmptyLine",
	"Function"
];

const getRandomVariable = () => {
	return variableList[Math.floor(Math.random() * variableList.length)];
};

const getRandomCodeType = () => {
	return codeStruct[Math.floor(Math.random() * codeStruct.length)];
};

const genRequireCode = () => {
	var tmpVar = getRandomVariable();
	return `var ${tmpVar} = require('${tmpVar}');\n`;
};

const genVariableCode = () => {
	return `var ${getRandomVariable()};\n`;
};

const genConditionCode = () => {
	return `if (${getRandomVariable()}) {
	${getRandomVariable()} = ${getRandomVariable()};
} else {
	${getRandomVariable()} = ${getRandomVariable()};
}\n`;
};

const genCommentCode = () => {
	var wordNum = Math.floor(Math.random() * 5);
	var punctuationList = ['', '', '', '', '', '', '', ',', ',', ',', ',', '.', '!'];
	var result = "//";
	for (var i = 0; i < wordNum; i++) {
		var punctuation = punctuationList[Math.floor(Math.random() * punctuationList.length)];
		result += `${getRandomVariable()}${punctuation} `;
	}
	result += `\n`;
	return result;
};

const genEmptyLineCode = () => {
	return "\n";
};

const genFunctionCode = () => {
	var fnStruct = [
	"Variable",
	"Condition",
	"Condition",
	"Condition",
	"Comment",
	"EmptyLine",
	"Function"
	];

	var argNum = Math.floor(Math.random() * 5);
	var fnName = getRandomVariable();
	var argList = [];
	for (var i = 0; i < argNum; i++) {
		argList.push(getRandomVariable());
	}

	var codeNum = Math.floor(Math.random() * 5) + 1;
	var codeBody = ``;

	for (var i = 1; i < codeNum; i++) {
		var fnStructType = fnStruct[Math.floor(Math.random() * fnStruct.length)];
		codeBody += eval(`gen${fnStructType}Code()`);
	}
	codeBody = codeBody.replace(/^/gm, "	");
	var result = `var ${fnName} = function (${argList.join(', ')}) {
${codeBody}
};\n`;
	return result;
};

var allCodeNum = 100;

var saveCode = function (code, total, index) {
	var logData = `${code}`;
	var logFile = './logs/generatedCode.js';
	fs.appendFileSync(logFile, logData, {encoding: 'utf8', flag: 'a+'});
	console.log(`${index}/${total}`);
};

var allGenRun = (codeNum) => {
	codeNum = codeNum || 100;
	for (var i = 0; i < codeNum; i++) {
		var codeType = codeStruct[Math.floor(Math.random() * codeStruct.length)];
		var codeBody = `${eval(`gen${codeType}Code()`)}`;
		saveCode(codeBody, codeNum, i);
	}
};

allGenRun(10000);