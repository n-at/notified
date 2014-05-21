var daemon = require('daemonize2').setup({
    main: 'notified.js',
    pidfile: 'notified.pid',
    name: 'notified'
});

var argv = require('optimist').argv;

switch(argv._[0]) {
    case 'start':
        daemon.start();
        break;

    case 'stop':
        daemon.stop();
        break;

    case 'restart':
        daemon.stop(function() {
            daemon.start();
        });
        break;

    case 'reload':
        console.log('Reloading notified...');
        daemon.sendSignal('SIGNOTIFIEDRELOAD');
        break;

    case 'status':
        var pid = daemon.status();
        if(pid) {
            console.log('notified is running with pid:%s', pid);
        } else {
            console.log('notified is not running');
        }
        break;

    case 'version':
        console.log('notified ' + require('./package').version);
        break;

    default:
        console.log('Usage: [start|stop|restart|status|version]');
}
