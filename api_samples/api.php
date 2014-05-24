<?php

/**
 * @param $server string Server address and port like "http://localhost:3000"
 * @param $template string Notification template name
 * @param $api_key string Notification key
 * @param $message array Notification message fields
 * @return string Server response or FALSE if connection failed
 */
function notified($server, $template, $api_key, $message) {
    $message['api_key'] = $api_key;
    $message['api_template'] = $template;
    return @file_get_contents($server, false, stream_context_create(array(
        'http'=>array('method'=>'POST', 'header'=>'Content-type: application/x-www-form-urlencoded',
            'content'=>http_build_query($message))
    )));
}

//usage example

$server = 'http://localhost:3000';
$template = 'sample';
$api_key = 'secret';

$message = array(
    'api_to' => 'john@example.com',
);

echo notified($server, $template, $api_key, $message);