<?php

use Cti\Core\Application\Factory;

$root = dirname(dirname(__DIR__));

include $root . '/vendor/autoload.php';
chdir($root);

Factory::create($root)
    ->getApplication()
    ->getConsole()
    ->run();
