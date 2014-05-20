var fs = require('fs');
var path = require('path');
var async = require('async');
var twig = require('twig').twig;

var config = require('../config');
var log = require('./logger')(module);

var notificationTemplates = null;

module.exports.load = function(callback) {
    log.info('Loading notification templates...');

    notificationTemplates = {};

    var templatePath = config.get('template_path');

    fs.readdir(templatePath, function(err, files) {
        if (!err) {
            async.each(files,
                loadNotificationTemplate,
                function (err) {
                    if (err) {
                        log.error('Error occurred while loading templates (%s)', err.message);
                        callback(err);
                    } else {
                        log.info('Notification templates loaded (Total: %d)', Object.keys(notificationTemplates).length);
                        callback();
                    }
                }
            );
        } else {
            log.error('Error occurred while fetching templates list');
            callback(err);
        }
    });
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

function loadTwig(template, callback) {
    return function() {
        twig({
            path: path.join(config.get('template_path'), template.template),
            load: function(tpl) {
                template.templateInstance = tpl;
                addTemplateToCollection(template, callback);
            },
            error: twigLoadingError(template, callback)
        });
    };
}

function twigLoadingError(template, callback) {
    return function(err) {
        log.error('Twig template not loaded for "%s" (%s)', template.name, err.message);
        callback();
    }
}

function addTemplateToCollection(template, callback) {
    if(template !== null) {
        notificationTemplates[template.name] = template;
    }
    callback();
}

function loadNotificationTemplate(fileName, callback) {
    if(isTemplateFile(fileName)) {
        var template = null;

        //sync part of template loading
        try {
            var templateFilePath = path.join(config.get('template_path'), fileName);
            var templateName = fileName.substr(0, fileName.search(/\.json$/));
            log.info('Loading template "%s"...', templateName);

            template = require(templateFilePath);
            template.name = templateName;

            //create notification transport
            if(!template.transport) {
                log.error('Transport is not set for notification "%s"', templateName);
            }
            var transportModulePath = path.join(config.get('transport_path'), template.transport);
            log.info('Loading transport "%s" from "%s"', template.transport, transportModulePath);

            var transport = require(transportModulePath);
            template.transportInstance = new transport(template.transportConfig);

        } catch(err) {
            log.error('Notification template "%s" is not loaded (%s)', fileName, err.message);
            template = null;
        }

        //async part: twig
        if(template !== null && template.template) {
            var domain = require('domain').create();
            domain.on('error', twigLoadingError(template, callback));
            domain.run(loadTwig(template, callback));
        } else {
            addTemplateToCollection(template, callback);
        }
    } else {
        callback();
    }
}
