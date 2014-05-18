var winston = require('winston');
var path = require('path');

var config = require('../config');

var ENV = process.env.NODE_ENV;

function getLogger(module) {
    var moduleName = module.filename.split(path.sep).slice(-2).join('/');

    if(!(module.filename in winston.loggers)) {
        var logLevel = (ENV == 'development') ? 'debug' : 'error';
        winston.loggers.add(module.filename, {
            file: {
                filename: path.join(config.get('log_path'), config.get('log_file')),
                json: false,
                level: logLevel,
                label: moduleName
            },
            console: {
                colorize: true,
                level: logLevel,
                label: moduleName
            }
        });
    }

    return winston.loggers.get(module.filename);
}

module.exports = getLogger;