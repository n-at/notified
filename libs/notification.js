
var config = require('../config');
var notification_template = require('./notification_template');
var log = require('./logger')(module);
var Notification = require('./models/notification').Notification;

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

    var templateName = data['api_template'];
    var notificationDocument = null;
    if(template.storeInDb) { //prepare notification document
        notificationDocument = new Notification({
            template: templateName,
            body: data
        });
    }

    //render notification body
    var renderedNotification = null;
    if(template.template) {
        try {
            renderedNotification = template.templateInstance.render(data);
        } catch(err) {
            log.error('Error occurred while rendering notification "%s" (%s)', templateName, err.message);
        }
    }
    data['api_template_rendered'] = renderedNotification;

    template.transportInstance.notify(data, function(err) {
        var status = config.get('notify_not_sent');
        var dateSent = null;
        if(err) {
            log.error('Error occurred while transferring notification "%s" (%s)', templateName, err.message);
            status = config.get('notify_error');
        } else {
            status = config.get('notify_ok');
            dateSent = Date.now();
        }

        if(template.saveInDb) {
            notificationDocument.set('status', status);
            notificationDocument.set('dateSent', dateSent);
            notificationDocument.save();
        }
    });
}
