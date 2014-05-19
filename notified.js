var http = require('http');
var qs = require('querystring');

var config = require('./config');
var log = require('./libs/logger')(module);
var notification_template = require('./libs/notification_template');
var notification = require('./libs/notification');

notification_template.load(function() {
    log.log('info', 'notified started');
    http.createServer(notificationProcessing).listen(config.get('port'), config.get('host'));
});

function notificationProcessing(req, res) {
    log.log('info', 'New request');

    if(req.method != 'POST') {
        res.statusCode = 405;
        res.end('Only POST allowed');
        log.info('Invalid request method: ' + req.method);
        return;
    }

    //Ok, method is POST, get request body
    var body = '';
    req.on('data', function(data) {
        body += data;

        //flood detection
        if(body.length > config.get('request_max_length')) {
            res.statusCode = 413;
            res.end('Request body length limit exceeded');
            req.connection.destroy();
            log.info('Request length limit exceeded');
        }
    });

    req.on('end', function() {
        log.info('Received %d bytes', body.length);

        //parse request
        var postData = null;
        try {
            postData = qs.parse(body);
        } catch(e) {
            res.statusCode = 400;
            res.end('Bad (probably malformed) request');
            log.error('Bad request');
        }

        if(notification.send(postData)) {
            res.statusCode = 200;
            res.end('OK');
        } else {
            res.statusCode = 400;
            res.end('Wrong template or API key');
        }
    });

    req.on('error', function() {
        res.statusCode = 500;
        res.end('An error occurred while processing the request');
        req.connection.destroy();
        log.error('Request processing error');
    });
}