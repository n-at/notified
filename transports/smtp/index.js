var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var log = require('../../libs/logger')(module);

function SmtpTransport(config) {
    this.config = updateConfig(config || {});

    var options = {};

    if(this.config.service !== undefined) {
        options.service = this.config.service;
    } else {
        options.host = this.config.host;
        options.port = this.config.port;
    }
    if(this.config.secureConnection !== undefined) {
        options.secureConnection = this.config.secure;
    }
    if(this.config.tls !== undefined) {
        options.ignoreTLS = !this.config.tls;
    }
    if(this.config.auth) {
        options.auth = {
            user: this.config.username,
            pass: this.config.password
        };
    }

    this.transport = nodemailer.createTransport(smtpTransport(options));
}

SmtpTransport.prototype.notify = function(notification, callback) {
    log.debug('Preparing message...');

    var message = {};

    //from
    message.from = (this.config.override_from) ? notification.api_from : this.config.from;
    if(!message.from) {
        log.debug('From value is empty');
    }

    //to
    message.to = (this.config.override_to) ? notification.api_to : this.config.to;
    if(!message.to) {
        callback(new Error('To value required but empty'));
        return;
    }

    //cc, bcc, reply_to
    message.cc = (this.config.override_cc) ? notification.api_cc : this.config.cc;
    message.bcc = (this.config.override_bcc) ? notification.api_bcc : this.config.bcc;
    message.replyTo = (this.config.override_reply_to) ? notification.api_reply_to : this.config.reply_to;

    //subject
    message.subject = (this.config.override_subject) ? notification.api_subject : this.config.subject;
    if(!message.subject) {
        log.debug('Message is missing subject');
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
    var defaultConfig = require('./defaultConfig');
    for(var option in defaultConfig) {
        if(defaultConfig.hasOwnProperty(option) && config.hasOwnProperty(option) === false) {
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
        if(notificationData.hasOwnProperty(optionName) && optionName.match(/^api_attach_.+/)) {
            attachments.push({
                filename: optionName.substr('api_attach_'.length),
                content: notificationData[optionName],
                encoding: 'base64'
            });
        }
    }
    return attachments;
}

module.exports = SmtpTransport;
