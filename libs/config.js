var nconf = require('nconf');
var path = require('path');
var mkdirp = require('mkdirp');

var root = path.join(__dirname, '..');

nconf.argv()
     .env()
     .file(path.join(root, path.join('config', 'config.json')));

//set up paths
nconf.set('root_path', root);
nconf.set('log_path', path.join(root, 'logs'));
nconf.set('template_path', path.join(root, 'templates'));
nconf.set('transport_path', path.join(root, 'transports'));

//constants
nconf.set('notify_ok', 1);
nconf.set('notify_not_sent', 0);
nconf.set('notify_error', 2);

mkdirp.sync(nconf.get('log_path'));

module.exports = nconf;
