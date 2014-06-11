<?php

namespace Scheduler;

use Storage\Master;
use Cti\Storage\Adapter\DBAL;

class Runner
{
    public $createSystemFail = true;

    function init(Init $init, Master $master, DBAL $adapter)
    {
        $system = $master->getJobs()->findOne(array('system' => true));
        $now = $adapter->fetchNow();

        if($system->getActiveTask()) {
            $message = sprintf("Task %s is running", $system->getActiveTask()->getIdTask());

            if($this->createSystemFail) {

                $task = $system->createActiveTask()->setDtEnd($now)->setStatus('F')->save();
                $task->log($message);
            }

            throw new \Exception($message);
        }

        $task = $system->createActiveTask();

        $tasks = $master->getTasks()->findWhere('dt_scheduled < :now and status = :status', array(
            'now' => $now,
            'status' => 'N'
        ));

        if(count($tasks)) {
            $task->log(sprintf('Found %s task(s).', count($tasks)));
            foreach($tasks as $task) {
                // 
            }
            
        } else {
            $task->log('No tasks found');
        }

        $task->setDtEnd($adapter->fetchNow(true))->setStatus('C')->save();
    }
}