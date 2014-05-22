notified
========

Node.js notification daemon

##Installation

**Requirements:**

+ *node.js*
+ *npm*
+ *MongoDB*

To install, just run:

    git clone https://github.com/n-at/notified.git
    cd notified
    npm install

##Starting notified

To run notified:

    node notified

notified also can be run as a system daemon:

    node notified-ctl [start|stop|restart|status|version]

##Documentation

notified modules documentation can be found in files *readme.md* in respective directories.
Also take a look at *templates/sample.json* notification template.