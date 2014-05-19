var nodemailer = require('nodemailer');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    this.config = applyConfig(config);
    var transport = nodemailer.createTransport('SMTP', {
        service: this.config.service,
        host: this.config.host,
        port: this.config.port,
        secureConnection: this.config.secure,
        auth: {
            user: this.config.username,
            pass: this.config.password
        },
        ignoreTLS: !this.config.tls,
        maxConnections: this.config.poolSize
    });
    transport.on('error', function(err) {
        log.error('SMTP transport error: %s', err.message);
    });

    this.transport = transport;
}

SmtpTransport.prototype.notify = function(notification, callback) {
    log.info('Starting notification...');
    //TODO send notification here
    callback();
};

module.exports = SmtpTransport;

function applyConfig(config) {
    for(var option in defaultConfig) {
        if(defaultConfig.hasOwnProperty(option) && config.hasOwnProperty(option) == false) {
            config[option] = defaultConfig[option];
        }
    }
}

var defaultConfig = {
    //connection options
    port: 25,
    secure: false,
    tls: true,
    poolSize: 5,

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