var fs = require('fs');
var path = require('path');
var config = require('../config');
var log = require('./logger')(module);

var notificationTemplates = null;

function load() {
    log.info('Loading templates...');
    var templatePath = config.get('template_path');
    var files = fs.readdirSync(templatePath);
    var templates = [];
    for(var i = 0; i < files.length; i++) {
        if(files[i].match(/.+\.json/)) {
            try {
                var fileName = path.join(config.get('template_path'), files[i]);
                templates.push(require(fileName));
            } catch(err) {
                log.error('Notification template (%s) not loaded (%s)', files[i], err.message);
            }
        }
    }
    log.info('Loaded %d notification templates', templates.count);
    notificationTemplates = templates;
}

module.exports.get = function() {
    if(notificationTemplates === null) {
        load();
    }
    return notificationTemplates;
};

module.exports.reload = function() {
    notificationTemplates = null;
    load();
    return notificationTemplates;
};