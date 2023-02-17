const __config = require('./config/config');
const redis = require('redis-pool-fns')(__config.redis);
const openAI = require('./lib/openAI')(__config.openAI, redis);

const text = '说一下薛之谦的歌，介绍一下他都有哪些歌曲，歌词都是什么？';

openAI.ask(text, 'abc');