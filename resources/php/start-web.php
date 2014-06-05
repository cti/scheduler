<?php

if(strpos($_SERVER['REQUEST_URI'], '/public') === 0) {
    return false;
}

if(strpos($_SERVER['REQUEST_URI'], '/favicon.ico') === 0) {
    return false;
}

use Cti\Core\Application\Factory;

$root = dirname(dirname(__DIR__));

include $root . '/vendor/autoload.php';
chdir($root);

Factory::create($root)
    ->getApplication()
    ->getWeb()
    ->run();
