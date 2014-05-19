var fs = require('fs');
var path = require('path');
var config = require('../config');
var log = require('./logger')(module);

var notificationTemplates = null;

module.exports.load = function(callback) {
    log.info('Loading templates...');
    var templatePath = config.get('template_path');
    var files = fs.readdirSync(templatePath);
    var templates = {};
    var templateCount = 0;
    for(var i = 0; i < files.length; i++) {
        if(files[i].match(/.+\.json$/)) {
            try {
                var fileName = path.join(config.get('template_path'), files[i]);
                var templateName = files[i].substr(0, files[i].search(/\.json$/));
                log.info('Loading template "%s"...', templateName);

                var template = require(fileName);

                //create notification transport
                var transportModulePath = path.join(config.get('transport_path'), template.transport);
                log.info('Loading transport from "%s"', transportModulePath);

                var transport = require(transportModulePath);
                template.transportInstance = new transport(template.transportConfig);

                templates[templateName] = template;
                templateCount++;
            } catch(err) {
                log.error('Notification template "%s" is not loaded (%s)', files[i], err.message);
            }
        }
    }
    log.info('Loaded %d notification templates', templateCount);
    notificationTemplates = templates;
    callback(templates);
};

module.exports.get = function() {
    return notificationTemplates;
};

module.exports.reload = function(callback) {
    notificationTemplates = null;
    module.exports.load(callback);
};