SMTP transport
--------------

SMTP transport implementation uses [NodeMailer SMTP transport](https://github.com/andris9/nodemailer-smtp-transport).

Server configuration options:

+ *service* - service identifier (optional, see the [list of supported services](https://github.com/andris9/nodemailer-wellknown#supported-services))
+ *auth* - does the server need an authentication data (default **true**)
+ *username* - user name on server
+ *password* - password for user
+ *hostname* - hostname of SMTP server
+ *port* - port of SMTP server (default **25**)
+ *secure* - use SSL (default **false**)
+ *tls* - use TLS (default **true**)

If service specified, options *hostname*, *port*, *secure* and *tls* should not be specified.

Message configuration options:

+ *to* - notification recipients (comma separated list)
+ *from* - sender address
+ *cc* - comma separated list of recipients (Cc (copy) field) (empty by default)
+ *bcc* - comma separated list of recipients (Bcc (blind copy) field) (empty by default)
+ *reply_to* - address in *Reply-To* field (empty by default)
+ *subject* - notification subject (empty by default)
+ *body* - message body (empty by default)
+ *charset* - notification body charset (default **utf-8**)
+ *html* - use HTML in message body (default **true**)
+ *allow_attachments* - allow to add attachments from notification fields (default **false**). Attachments is Base64 encoded

Notification field that contains an attachment should have name like *api_attach_<file_name>* and it's content should be Base64-encoded.

Override options:

+ *override_to* - get the **To** field from notification field *api_to*
+ *override_from* - get the **From** field from notification field *api_from*
+ *override_subject* - get the **Subject** field from notification field *api_subject*
+ *override_cc* - get the **Cc** field from notification field *api_cc*
+ *override_bcc* - get the **Bcc** field from notification field *api_bcc*
+ *override_reply_to* - get the **Reply-To** field from notification field *api_reply_to*
+ *override_body* - get body of message from notification data

**Note:** all *override* fields are **false** by default, except of *override_body*.
