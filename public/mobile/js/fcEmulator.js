const loadNesGame = (gameId) => {
	var nesUrl = fcRomList[gameId].url;
	$.ajax({
		url: nesUrl,
		type: "GET",
		success: (data) => {
			localStorage[gameId] = data;
		},
		error: (err) => {
			console.log(err);
			alert('下载游戏失败');
		}
	});
};

var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH*SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4*1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0, audio_read_cursor = 0;

var nes = new jsnes.NES({
	onFrame: function(framebuffer_24){
		for(var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
	},
	onAudioSample: function(l, r){
		audio_samples_L[audio_write_cursor] = l;
		audio_samples_R[audio_write_cursor] = r;
		audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
	},
	onStatusUpdate: function () {
		console.log('update');
	}
});

var nes_boot = function (rom_data) {
	nes.loadROM(rom_data);

	setInterval(nes.frame, 17);
	window.requestAnimationFrame(onAnimationFrame);
};

function audio_remain(){
	return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

var onAnimationFrame = function () {
	window.requestAnimationFrame(onAnimationFrame);
	
	image.data.set(framebuffer_u8);
	canvas_ctx.putImageData(image, 0, 0);
};

var audio_callback = function (event) {
	var dst = event.outputBuffer;
	var len = dst.length;
	
	if(audio_remain() < AUDIO_BUFFERING) nes.frame();
	
	var dst_l = dst.getChannelData(0);
	var dst_r = dst.getChannelData(1);
	for(var i = 0; i < len; i++){
		var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
		dst_l[i] = audio_samples_L[src_idx];
		dst_r[i] = audio_samples_R[src_idx];
	}
	
	audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
};

var nes_init = function (canvas_id) {
	var canvas = document.getElementById(canvas_id);
	canvas_ctx = canvas.getContext("2d");
	image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	canvas_ctx.fillStyle = "black";
	canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// Allocate framebuffer array.
	var buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
	framebuffer_u32 = new Uint32Array(buffer);
	
	// Setup audio.
	var audio_ctx = new window.AudioContext();
	var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	script_processor.onaudioprocess = audio_callback;
	script_processor.connect(audio_ctx.destination);
};

const startNesGame = (gameId) => {
	if (!localStorage[gameId]) {
		loadNesGame(gameId);
		return;
	}

	var buffer = localStorage[gameId];
	nes_init('nes-canvas');
	nes_boot(buffer);
};

const fcRomList = {
	'283d4f90413953592199786e63f02999476f1d90ed385588b21e9b28cd01abc2': {
		name: 'Adventure Island II (USA).nes',
		url: 'https://static.hewenhan.me/userFiles/283d4f90413953592199786e63f02999476f1d90ed385588b21e9b28cd01abc2.nes'
	}
};
