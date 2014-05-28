notified configuration
----------------------

Options:

+ *host* - host to listen. Set to **127.0.0.1** for listening to local interfaces only. For listening to all interfaces set this to **0.0.0.0**
+ *port* - port to listen
+ *log_file* - log file name
+ *log_level* - importance level of events to be logged (can be **debug**, **info**, **warn** and **error**, default is **info**)
+ *request_max_length* - maximum length of incoming request (used for flood protection)
+ *mongodb* - MongoDb connection settings (*host*, *port* and *dbname*)
