var nconf = require('nconf');
var path = require('path');
var mkdirp = require('mkdirp');

nconf.argv()
     .env()
     .file(path.join(__dirname, 'config.json'));

//set up paths
var root = path.join(__dirname, '..');
nconf.set('root_path', root);
nconf.set('log_path', path.join(root, 'logs'));
nconf.set('template_path', path.join(root, 'templates'));

mkdirp.sync(nconf.get('log_path'));

module.exports = nconf;