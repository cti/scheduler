<?php

namespace Storage\Migration;

use Cti\Storage\Schema;

/**
 * Migration was generated at 05.06.2014 10:36:20
 */
class Scheduler_20140605_103620 
{
    public function process(Schema $schema)
    {
        $schema->setNamespace('scheduler');

        $job = $schema->createModel('job', 'Job', array(
            'name' => 'Name',
            'status' => 'Status',
            array('system', 'integer', 'System command'),
        ));

        $schedule = $schema->createModel('schedule', 'Schedule', array(
            'type' => 'Type',
            'month' => 'Month',
            'day' => 'Day',
            'hour' => 'Hour',
            'minute' => 'Minute',
            'dt_next' => 'Date for next running'
        ));
        $job->hasOne($schedule);

        $command = $schema->createModel('command', 'Job Command', array(
            'command' => 'Command',
            array('priority', 'integer', 'Priority')
        ));
        $command->hasOne($job);

        // New, Active, Complete, Fail
        $task = $schema->createModel('task', 'Task', array(
            'dt_scheduled' => 'Scheduled start date',
            'dt_start' => 'Fact start date',
            'dt_end' => 'Fact end date',
            'status' => 'Status',
            array('success', 'integer', 'Success'),
        ));
        $task->hasOne($job);

        $log = $schema->createModel('log', 'Log', array(
            'output' => 'Output',
            'dt_log' => 'Log date'
        ));
        $log->hasOne($task);
    }
}