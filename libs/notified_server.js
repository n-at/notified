var querystring = require('querystring');

var config = require('../config');
var log = require('./logger')(module);
var notification = require('./notification');

function notificationProcessing(req, res) {
    log.debug('New request');

    if(req.method != 'POST') {
        res.statusCode = 405;
        res.end('Only POST allowed');
        log.warn('Invalid request method: ' + req.method);
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
            log.warn('Request length limit exceeded');
        }
    });

    req.on('end', function() {
        log.debug('Received %d bytes', body.length);

        //parse request
        var postData = null;
        try {
            postData = querystring.parse(body);
        } catch(e) {
            res.statusCode = 400;
            res.end('Bad (probably malformed) request');
            log.warn('Bad request');
        }

        if(notification.send(postData)) {
            res.statusCode = 200;
            res.end('OK');
        } else {
            res.statusCode = 400;
            res.end('Wrong template or API key');
        }
    });

    req.on('error', function(err) {
        res.statusCode = 500;
        res.end('An error occurred while processing the request');
        req.connection.destroy();
        log.error('Request processing error (%s)', err.message);
    });
}

module.exports = notificationProcessing;
