var http = require('http');

var config = require('./config');
var log = require('./libs/logger')(module);

log.log('info', 'notified started');

http.createServer(function(req, res) {
    log.log('info', 'New connection');
    res.end('Hello, world!');
}).listen(config.get('port'), config.get('host'));
