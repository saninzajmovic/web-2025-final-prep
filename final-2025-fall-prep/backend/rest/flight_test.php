<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Loading Flight...<br>";
require __DIR__ . "/../vendor/autoload.php";

echo "Setting up basic route...<br>";
Flight::route('/', function(){
    echo 'Hello world!';
});

Flight::route('/test', function(){
    echo 'Test route working!';
});

echo "Starting Flight...<br>";
Flight::start();
?>