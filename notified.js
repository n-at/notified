var http = require('http');
var querystring = require('querystring');

var config = require('./config');
var log = require('./libs/logger')(module);
var notification_template = require('./libs/notification_template');
var notified_server = require('./libs/notified_server');

notification_template.load(function(err) {
    if(err) {
        log.error('Error occurred during the initialization (%s)', err.message);
        return;
    }

    http.createServer(notified_server).listen(config.get('port'), config.get('host'));
    log.log('info', 'notified started');
});

