var nconf = require('nconf');
var path = require('path');
var mkdirp = require('mkdirp');

nconf.argv()
     .env()
     .file(path.join(__dirname, 'config.json'));

//set up paths
nconf.set('root_path', path.join(__dirname, '..'));
nconf.set('log_path', path.join(nconf.get('root_path'), 'logs'));

mkdirp.sync(nconf.get('log_path'));

module.exports = nconf;