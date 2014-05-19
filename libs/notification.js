
var notification_template = require('./notification_template');
var log = require('./logger')(module);

module.exports.send = function(notificationData) {

    var templateName = notificationData['api_template'];
    var apiKey = notificationData['api_key'];

    if(templateName === undefined || apiKey === undefined) {
        log.info('Notification is missing template name or API key');
        return false;
    }

    var template = notification_template.get(templateName);
    if(template === undefined || template['api_key'] !== apiKey) {
        log.info('API key mismatch');
        return false;
    }

    process.nextTick(function() {
        executeNotificationTemplate(template, notificationData);
    });

    return true;
};

function executeNotificationTemplate(template, data) {
    log.info('Processing notification...');
}