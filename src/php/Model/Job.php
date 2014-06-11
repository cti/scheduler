<?php

namespace Model;

class Job extends \Storage\Model\JobBase
{
    function getActiveTask()
    {
        $tasks = $this->getTasksByStatus('A');
        if(count($tasks) > 1) {
            throw new \Exception(sprintf("Job %s has %s active tasks!", $this->getName(), count($tasks)));
        }
        if(count($tasks)) {
            return $tasks[0];
        }
    }

    function getTasksByStatus($status)
    {
        $params = array(
            'id_job' => $this->getIdJob(), 
            'status' => $status
        );

        return $this->getRepository()->getMaster()->getTasks()->findAll($params, 'many');
    }

    function createActiveTask()
    {
        $master = $this->getRepository()->getMaster();
        $now = $master->getDatabase()->fetchNow(true);
        $task = $master->create('task', array(
            'status' => 'A',
            'dt_scheduled' => $now,
            'dt_start' => $now
        ))->setJob($this)->save();

        return $task;
    }
}