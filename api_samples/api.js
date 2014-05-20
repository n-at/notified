var querystring = require('querystring');
var http = require('http');

function notified(server, template, apiKey, message, callback) {
    message['api_template'] = template;
    message['api_key'] = apiKey;
    var post_data = querystring.stringify(message);

    var options = {
        host: server.host,
        port: server.port,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var data = '';
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(null, data);
        });
    });

    req.write(post_data);
    req.end();
}

notified({host: 'localhost', port: '3000'}, 'sample', 'secret', {to: 'john@example.com'}, function(err, data) {
    if(err) console.log(err.message);
    if(data) console.log(data);
});