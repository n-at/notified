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

Don't forget to check out notified configuration in */config/config.json*.

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

## Using notified

First, you need to create a *notification template*. It is a JSON file in */templates* directory that describes
your notification.

Every notification needs a transport. It is a module that actually deliver notifications. notified by default has two
available transports: `smtp` (sends notifications by email) and `pickup_directory` (saves notifications in a
local directory). You can add your own transports in */transports* directory.

All notification template configuration options described in the */templates/readme.md*.

When notified is started, you can send it a POST request with notification data. This data should contain template name
(`api_template` field), template key (`api_key` field), transport configuration fields (if needed). Other request
fields can be used for rendering the notification body.

##Documentation

notified modules documentation can be found in files *readme.md* in respective directories.

Also take a look at *templates/sample.json* notification template.
