var http = require('http');
var qs = require('querystring');

var config = require('./config');
var log = require('./libs/logger')(module);

log.log('info', 'notified started');

http.createServer(function(req, res) {
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
        if(body.length > config.get('body_max_length')) {
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

        console.log(postData); //TODO real data processing here :)

        res.statusCode = 200;
        res.end('OK');
    });

    req.on('error', function() {
        res.statusCode = 500;
        res.end('An error occurred while processing the request');
        req.connection.destroy();
        log.error('Request processing error');
    });
}).listen(config.get('port'), config.get('host'));
