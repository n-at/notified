SMTP transport
--------------

SMTP transport implementation uses [NodeMailer](http://www.nodemailer.com).

Server configuration options:

+ *service* - service identifier (optional, see the list of supported services below)
+ *username* - user name on server
+ *password* - password for user
+ *hostname* - hostname of SMTP server
+ *port* - port of SMTP server (default **25**)
+ *secure* - use SSL (default **false**)
+ *tls* - use TLS (default **true**)
+ *poolSize* - max number of connections in the pool (default **5**)

If service specified, options *hostname*, *port*, *secure* and *tls* are not needed.

Services supported by NodeMailer: DynectEmail, Gmail, hot.ee, Hotmail, iCloud, mail.ee, Mail.Ru, Mailgun, Mailjet, Mandrill, Postmark, QQ, QQex (Tencent Business Email), SendGrid, SES, Yahoo, yandex, Zoho

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

Override options:

+ *override_to* - get the **To** field from notification field *api_smtp_to*
+ *override_from* - get the **From** field from notification field *api_smtp_from*
+ *override_subject* - get the **Subject** field from notification field *api_smtp_subject*
+ *override_cc* - get the **Cc** field from notification field *api_smtp_cc*
+ *override_bcc* - get the **Bcc** field from notification field *api_smtp_bcc*
+ *override_reply_to* - get the *Reply-To* field from notification field *api_smtp_reply_to*
+ *override_body* - get body of message from notification data

**Note:** all *override* fields are **false** by default, except of *override_body*.