notified
========

Node.js notification daemon

##Installation

**Requirements:**

+ *node.js*
+ *npm*
+ *MongoDB* (recommended but optional)

To install, just run:

    git clone https://github.com/n-at/notified.git
    cd notified
    npm install

##Starting notified

To run notified:

    node notified

notified also can be run as a system daemon:

    node notified-ctl [start|stop|restart|status|version]

##Starting with *forever*

[Forever](https://github.com/nodejitsu/forever) - is a CLI tool that can run any script as daemon and restarts it when one crashed.

To install *forever*:

    $ [sudo] npm install -g forever

Start notified:

    forever [start|stop|restart] notified.js

**Note:** *forever* may not work on windows.

##Documentation

notified modules documentation can be found in files *readme.md* in respective directories.
Also take a look at *templates/sample.json* notification template.