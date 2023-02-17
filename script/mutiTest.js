const cluster = require("cluster")
const fs = require("fs")
const os = require("os")


console.log(`1 - ${new Date()}`);
for (var i = 0; i < 200000; i++) {
	for (var j = 1; j < 10000; j++) {
		// console.log(i / j)
	}
}
console.log(`2 - ${new Date()}`);

// return;
console.log('/////////////////////////////////////');

if (cluster.isMaster) {
	console.log("master" + process.pid + "正在运行")
	const cpus = os.cpus().length
	for (let i = 0; i < cpus; i++) {
		cluster.fork()
	}
	cluster.on("exit", (worker, code, signal) => {
		console.log("工作进程" + worker.process.pid + "已退出")
	})
} else {
	console.log(`3 - ${new Date()}`);
	for (var i = 0; i < 200000; i++) {
		for (var j = 1; j < 10000; j++) {
			// console.log(i / j)
		}
	}
	console.log(`4 - ${new Date()}`);
}