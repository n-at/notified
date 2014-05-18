var winston = require('winston');
var path = require('path');

var config = require('../config');

var ENV = process.env.NODE_ENV;

function getLogger(module) {
    var moduleName = module.filename.split(path.sep).slice(-2).join('/');
    var logLevel = (ENV == 'development') ? 'debug' : 'info';
    return new winston.Logger({
        transports: [
            new winston.transports.File({
                filename: path.join(config.get('log_path'), config.get('log_file')),
                json: false,
                level: logLevel,
                label: moduleName
            }),
            new winston.transports.Console({
                colorize: true,
                level: logLevel,
                label: moduleName
            })
        ]
    });
}

module.exports = getLogger;