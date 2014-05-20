var mongoose = require('mongoose');
var config = require('../config');
var log = require('./logger')(module);

var dsn = 'mongodb://'
    + config.get('mongodb:host')
    + ':' + config.get('mongodb:port')
    + '/' + config.get('mongodb:dbname');

mongoose.connect(dsn);

var db = mongoose.connection;
db.on('error', function(err) {
    log.error('MongoDB connection failure (%s)', err.message);
});
db.once('open', function() {
    log.info('Connected to MongoDB');
});

exports.mongoose = mongoose;