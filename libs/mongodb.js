var mongoose = require('mongoose');
var config = require('../config');
var log = require('./logger')(module);

var dsn = 'mongodb://'
    + config.get('mongodb:host')
    + ':' + config.get('mongodb:port')
    + '/' + config.get('mongodb::dbname');

mongoose.connect(dsn);

var db = mongoose.connection;
db.on('error', function() {
    log.error('MongoDB connection failure');
});
db.once('open', function() {
    log.info('Connected to MongoDB');
});

module.exports = mongoose;