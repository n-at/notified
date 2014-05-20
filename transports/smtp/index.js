var nodemailer = require('nodemailer');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    this.config = updateConfig(config);
    this.transport = nodemailer.createTransport('SMTP', {
        service: this.config.service,
        host: this.config.host,
        port: this.config.port,
        secureConnection: this.config.secure,
        auth: {
            user: this.config.username,
            pass: this.config.password
        },
        ignoreTLS: !this.config.tls,
        maxConnections: this.config.pool_size
    });
}

SmtpTransport.prototype.notify = function(notification, callback) {
    log.debug('Preparing message...');
    //TODO send notification here
    log.debug(notification);
    callback();
};

function updateConfig(config) {
    for(var option in defaultConfig) {
        if(defaultConfig.hasOwnProperty(option) && config.hasOwnProperty(option) == false) {
            config[option] = defaultConfig[option];
        }
    }
    return config;
}

var defaultConfig = {
    //connection options
    service: null,
    host: null,
    port: 25,
    secure: false,
    tls: true,
    username: null,
    password: null,
    pool_size: 5,

    //message options
    to: '',
    from: '',
    cc: '',
    bcc: '',
    reply_to: '',
    subject: '',
    body: '',
    charset: 'utf-8',
    html: true,

    //override options
    override_to: false,
    override_from: false,
    override_subject: false,
    override_cc: false,
    override_bcc: false,
    override_reply_to: false,
    override_body: true
};

module.exports = SmtpTransport;
