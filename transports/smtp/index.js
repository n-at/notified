var nodemailer = require('nodemailer');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    this.config = config;
    console.log(config); //TODO actual configuration here
}

SmtpTransport.prototype.notify = function(notification) {
    log.info('Starting notification...');
};

module.exports = SmtpTransport;