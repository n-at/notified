var nodemailer = require('nodemailer');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    console.log(config); //TODO actual configuration here
}

SmtpTransport.prototype.notify = function(notification) {

};

module.exports = SmtpTransport;