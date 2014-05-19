var nodemailer = require('nodemailer');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    this.config = config;
    //TODO actual configuration here
}

SmtpTransport.prototype.notify = function(notification) {
    log.info('Starting notification...');
    //TODO send notification here
};

module.exports = SmtpTransport;