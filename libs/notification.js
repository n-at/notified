var config = require('../config');
var notification_template = require('./notification_template');
var log = require('./logger')(module);
var Notification = require('./models/notification').Notification;


function prepareNotification(notificationData) {

    if(!notificationData) {
        log.warn('Empty notification');
        return false;
    }

    var templateName = notificationData.api_template;
    var apiKey = notificationData.api_key;

    if(templateName === undefined) {
        log.warn('Notification is missing template name');
        return false;
    }

    var template = notification_template.get(templateName);
    if(template === undefined) {
        log.warn('Template "%s" not found', templateName);
        return false;
    }
    if(template.api_key !== apiKey) {
        log.warn('API key mismatch');
        return false;
    }

    process.nextTick(function() {
        executeNotificationTemplate(template, notificationData);
    });

    return true;
}


function executeNotificationTemplate(template, data) {
    log.debug('Processing notification...');

    var templateName = template.name;
    var notificationDocument = null;
    if(template.db_save) { //prepare notification document
        notificationDocument = new Notification({
            template: templateName,
            body: data
        });
    }

    //render notification body
    var renderedNotification = null;
    if(template.templateInstance) {
        log.debug('Rendering notification body...');
        try {
            renderedNotification = template.templateInstance.render(data);
        } catch(err) {
            log.error('Error occurred while rendering notification "%s" (%s)', templateName, err.message);
            if(template.db_save) {
                notificationDocument.status = config.get('notify_error');
                notificationDocument.save(notificationSaveCallback(templateName));
            }
            return;
        }
    }
    data.api_template_rendered = renderedNotification;

    //send notification
    template.transportInstance.notify(data, function(err) {
        var status = config.get('notify_not_sent');
        var dateSent = null;
        if(err) {
            log.error('Error occurred while delivering notification "%s" (%s)', templateName, err.message);
            status = config.get('notify_error');
        } else {
            log.debug('Notification "%s" sent successfully', templateName);
            status = config.get('notify_ok');
            dateSent = Date.now();
        }

        //update document status
        if(template.db_save) {
            notificationDocument.set('status', status);
            notificationDocument.set('dateSent', dateSent);
            notificationDocument.save(notificationSaveCallback(templateName));
        }
    });
}


function notificationSaveCallback(templateName) {
    return function(err) {
        if(err) {
            log.error('Error occurred while saving notification "%s", (%s)', templateName, err.message);
        } else {
            log.debug('Notification "%s" saved successfully', templateName);
        }
    };
}


module.exports.send = prepareNotification;