var mongoose = require('mongoose');
var qs = require('querystring');
var Schema = mongoose.Schema;

var schema = new Schema({
    //notification template
    template: {
        type: String,
        required: true
    },

    //date of creation
    dateCreated: {
        type: Date,
        default: Date.now()
    },

    //date of transmission
    dateSent: Date,

    //notification status
    status: {
        type: Number,
        default: 0
    },

    //notification body (as string)
    bodyRaw: String
});

//notification body as array
schema.virtual('body')
    .set(function(body) {
        this._body = body;
        try {
            this.bodyRaw = qs.stringify(body);
        } catch(err) {
            this.bodyRaw = '';
        }
    })
    .get(function() {
        if(!this._body) {
            try {
                this._body = qs.parse(this.bodyRaw);
            } catch(err) {
                this._body = [];
            }
        }
        return this._body;
    });

exports.Notification = mongoose.model('Notification', schema);