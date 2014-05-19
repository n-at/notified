var fs = require('fs');
var path = require('path');
var config = require('../config');
var log = require('./logger')(module);

var notificationTemplates = null;

module.exports.load = function(callback) {
    log.info('Loading templates...');

    var templates = {};
    var templateCount = 0;

    var templatePath = config.get('template_path');
    var files = fs.readdirSync(templatePath);
    for(var i = 0; i < files.length; i++) {
        var fileName = files[i];
        if(isTemplateFile(fileName)) {
            try {
                var templateFilePath = path.join(config.get('template_path'), fileName);
                var templateName = fileName.substr(0, fileName.search(/\.json$/));
                log.info('Loading template "%s"...', templateName);

                var template = require(templateFilePath);

                //create notification transport
                var transportModulePath = path.join(config.get('transport_path'), template.transport);
                log.info('Loading transport "%s" from "%s"', template.transport, transportModulePath);

                var transport = require(transportModulePath);
                template.transportInstance = new transport(template.transportConfig);

                templates[templateName] = template;
                templateCount++;
            } catch(err) {
                log.error('Notification template "%s" is not loaded (%s)', fileName, err.message);
            }
        }
    }
    log.info('Loaded %d notification templates', templateCount);
    notificationTemplates = templates;
    callback(templates);
};

module.exports.allTemplates = function() {
    return notificationTemplates;
};

module.exports.get = function(templateName) {
    return notificationTemplates[templateName];
};

module.exports.reload = function(callback) {
    notificationTemplates = null;
    module.exports.load(callback);
};

//utility functions

function isTemplateFile(fileName) {
    return fileName.match(/.+\.json$/);
}