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

    fs.readdir(templatePath, function(err, files) {
        if (!err) {
            for(var i = 0; i < files.length; i++) {
                var fileName = files[i];
                loadNotificationTemplate(fileName);
            }
            log.info('Notification templates loaded (Total: %d)', Object.keys(notificationTemplates).length);
            callback();
        } else {
            log.error('Error occurred while fetching templates list (%s)', err.message);
            callback(err);
        }
    });
}


function isTemplateFile(fileName) {
    return fileName.match(/.+\.json$/);
}


function loadNotificationTemplate(fileName) {
    if(isTemplateFile(fileName)) {
        try {
            var templateFilePath = path.join(config.get('template_path'), fileName);
            var templateName = fileName.substr(0, fileName.search(/\.json$/));
            log.info('Loading template "%s"...', templateName);

            var template = require(templateFilePath);
            template.name = templateName;

            //create notification transport
            if(!template.transport) {
                log.error('Transport is not set for notification "%s"', templateName);
            }
            var transportModulePath = path.join(config.get('transport_path'), template.transport);
            log.info('Loading transport "%s" from "%s"', template.transport, transportModulePath);

            var Transport = require(transportModulePath);
            template.transportInstance = new Transport(template.transport_config);

            //load twig template
            if(template.template) {
                var twigPath = path.join(config.get('template_path'), template.template);
                template.templateInstance = twig({
                    path: twigPath,
                    async: false
                });
            }

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