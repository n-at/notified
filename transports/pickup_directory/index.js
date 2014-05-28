var path = require('path');
var nodemailer = require('nodemailer');
var mkdirp = require('mkdirp');

var SmtpTransport = require('../smtp');
var config = require('../../config');

function PickupTransport(config) {
    this.config = updateConfig(config || {});
    mkdirp.sync(this.config.directory);
    this.transport = nodemailer.createTransport('PICKUP', this.config);
}

PickupTransport.prototype.notify = SmtpTransport.prototype.notify;

function updateConfig(transportConfig) {
    //load default config
    var defaultConfig = require('./defaultConfig');
    for(var option in defaultConfig) {
        if(defaultConfig.hasOwnProperty(option) && transportConfig.hasOwnProperty(option) === false) {
            transportConfig[option] = defaultConfig[option];
        }
    }

    transportConfig.directory = transportConfig.directory ? transportConfig.directory : path.join(config.get('root_path'), 'pickup');

    return transportConfig;
}

module.exports = PickupTransport;
