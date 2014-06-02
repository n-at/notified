var fs = require('fs');
var path = require('path');
var twig = require('twig').twig;

var config = require('../config');
var log = require('./logger')(module);


var notificationTemplates = null;


function loadTemplates(callback) {
    log.info('Loading notification templates...');

    notificationTemplates = {};

    var templatePath = config.get('template_path');

    var files = [];
    try {
        files = fs.readdirSync(templatePath);
    } catch (err) {
        log.error('Error occurred while fetching templates list (%s)', err.message);
        callback(err);
    }

    for(var i = 0; i < files.length; i++) {
        var fileName = files[i];
        loadNotificationTemplate(fileName);
    }
    log.info('Notification templates loaded (Total: %d)', Object.keys(notificationTemplates).length);
    callback();
}


function isTemplateFile(fileName) {
    return fileName.match(/.+\.json$/);
}


function loadTransport(transportName, transportConfig) {
    if(!transportName) {
        throw new Error('Transport is undefined');
    }

    var transportModulePath = path.join(config.get('transport_path'), transportName);
    log.info('Loading transport "%s" from "%s"', transportName, transportModulePath);

    var Transport = require(transportModulePath);
    return new Transport(transportConfig);
}


function loadTwigTemplate(templateName) {
    if(!templateName) return null;

    var twigPath = path.join(config.get('template_path'), templateName);
    return twig({
        path: twigPath,
        async: false
    });
}


function loadNotificationTemplate(fileName) {
    if(isTemplateFile(fileName)) {
        try {
            var templateFilePath = path.join(config.get('template_path'), fileName);
            var templateName = fileName.substr(0, fileName.search(/\.json$/));
            log.info('Loading template "%s"...', templateName);

            var template = require(templateFilePath);
            template.name = templateName;

            template.transportInstance = loadTransport(template.transport, template.transport_config);
            template.templateInstance = loadTwigTemplate(template.template);

            notificationTemplates[templateName] = template;
        } catch(err) {
            log.error('Notification template "%s" is not loaded (%s)', fileName, err.message);
        }
    }
}


module.exports = {

    load: loadTemplates,

    get: function(templateName) {
        return notificationTemplates[templateName];
    }
};