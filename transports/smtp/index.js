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

    var message = {};

    //from
    message.from = (this.config.override_from) ? notification.api_smtp_from : this.config.from;
    if(!message.from) {
        log.debug('From value is empty');
    }

    //to
    message.to = (this.config.override_to) ? notification.api_smtp_to : this.config.to;
    if(!message.to) {
        callback(new Error('To value required but empty'));
        return;
    }

    //cc, bcc, reply_to
    message.cc = (this.config.override_cc) ? notification.api_smtp_cc : this.config.cc;
    message.bcc = (this.config.override_bcc) ? notification.api_smtp_bcc : this.config.bcc;
    message.replyTo = (this.config.override_reply_to) ? notification.api_smtp_reply_to : this.config.reply_to;

    //subject
    message.subject = (this.config.override_subject) ? notification.api_smtp_subject : this.config.subject;
    if(!message.subject) {
        log.debug('Message missing subject');
    }

    //body
    var body = (this.config.override_body) ? notification.api_template_rendered : this.config.body;
    if(!body) {
        log.debug('Message body is empty');
        body = '';
    }
    if(this.config.html) {
        message.html = body;
    } else {
        message.text = body;
    }

    //charset
    message.charset = this.config.charset ? this.config.charset : 'utf-8';

    //attachments
    if(this.config.allow_attachments) {
        message.attachments = getAttachments(notification);
    }

    this.transport.sendMail(message, callback);
};

function updateConfig(config) {
    //load default config
    for(var option in defaultConfig) {
        if(defaultConfig.hasOwnProperty(option) && config.hasOwnProperty(option) == false) {
            config[option] = defaultConfig[option];
        }
    }

    //connection options
    if(!config.service) {
        if(config.host === undefined) {
            log.error('Host is undefined');
        }
        if(config.port === undefined) config.port = 25;
        if(config.secure === undefined) config.secure = false;
        if(config.tls === undefined) config.tls = true;
    }

    return config;
}

function getAttachments(notificationData) {
    var attachments = [];
    for(var optionName in notificationData) {
        if(notificationData.hasOwnProperty(optionName) && optionName.match(/^api_smtp_attachment_.+/)) {
            attachments.push({
                fileName: optionName.substr('api_smtp_attachment_'.length),
                contents: (new Buffer(notificationData[optionName], 'base64'))
            });
        }
    }
    return attachments;
}

var defaultConfig = {
    //connection options
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
    allow_attachments: false,

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
