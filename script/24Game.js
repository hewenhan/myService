var numArr = ['a', 'b', 'c', 'd'];
var operatorArr = ['+', '-', '*', '/'];

var convertDecNumToArr = (devNum) => {
	var result = [];
	var devStr = devNum.toString();
	for (var i = 0; i < devStr.length; i++) {
		result.push(Number(devStr[i]));
	}
	return result;
};

var decConvertToOtherFormat = (decNum, targetFormat) => {
	var decArr = convertDecNumToArr(decNum);
	var revDevArr = decArr.reverse();

	var result = [];
	for (var i = 0; i < revDevArr.length; i++) {
		console.log('///////////////////////////////');
		console.log(result);
		result[i] = result[i + 1] ? result[i + 1] : 0;

		result[i] += revDevArr[i] % targetFormat;
		result[i + 1] = Math.floor(revDevArr[i] / targetFormat);
		console.log(result);
		console.log('///////////////////////////////');
	}
	console.log(result.reverse());
};

var combination = (cellArr) => {
	var possibleCount = Math.pow(cellArr.length, cellArr.length);
	var result = [];

	var onePossibleCombination = [];
	for (var i = 0; i < possibleCount; i++) {
		onePossibleCombination.push(numArr[i]);
	}
};

decConvertToOtherFormat(28, 4);