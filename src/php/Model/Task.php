<?php

namespace Model;

class Task extends \Storage\Model\TaskBase
{
    function log($message)
    {
        $master = $this->getRepository()->getMaster();
        $now = $master->getDatabase()->fetchNow(true);

        $log = $master->create('log', array(
            'dt_log' => $now,
            'output' => $message,
        ))->setTask($this)->save();

        return $log;
    }
}