var http = require('http');

var config = require('./config');
var log = require('./libs/logger')(module);
var notification_template = require('./libs/notification_template');
var notified_server = require('./libs/notified_server');

var server = http.createServer(notified_server);

notification_template.load(function(err) {
    if(err) {
        log.error('Error occurred during the initialization (%s)', err.message);
        process.exit(13);
        return;
    }
    server.listen(config.get('port'), config.get('host'));
    log.log('info', 'notified started');
});

//reload notified templates
process.on('SIGNOTIFIEDRELOAD', function() {
    log.info('Reloading templates...');
    server.close(function() {
        notification_template.load(function(err) {
            if(err) {
                log.error('Error occurred during reloading templates (%s)', err.message);
                process.exit(13);
                return;
            }
            server.listen(config.get('port'), config.get('host'));
            log.info('notified reloaded');
        });
    });
});

process.on('uncaughtException', function(err) {
    log.error('notified crashed (%s)', err.message);
    throw err;
});

process.once('SIGTERM', function() {
    log.info('Stopping notified...');
    server.on('close', function() {
        log.info('notified stopped');
    }).close();
});