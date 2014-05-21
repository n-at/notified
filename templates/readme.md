Notification templates
----------------------

Put your notification templates here (both *.json and *.twig files)

Configuration options:

+ *transport* - notification transport (module from *transports* directory). This is required field
+ *api_key* - string that used to authorize your APIs for interaction with notified
+ *template* - name of file in this directory that contains twig template for message rendering (optional)
+ *transport_config* - transport configuration
+ *db_save* - save notification data to mongodb collection (default **false**)

**Note:** parameters with names like *api_* can be notified or transport parameters.
Avoid of redefinition them in your templates.