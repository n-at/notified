Pickup directory transport
--------------------------

Provides local storage of e-mails so they can be picked up by SMTP server.
Also this transport is convenient for debug purposes.

As SMTP transport, Pickup directory uses [NodeMailer](http://www.nodemailer.com).

Configuration options:

+ *directory* - local directory to store e-mails (default **%notified_root%/pikup**)

All other options are taken from SMTP transport (except of server configuration). See *transports/smtp/readme.md*.