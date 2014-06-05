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
            'dt_last' => 'Last run',
            'dt_next' => 'Next run',
            'status' => 'Status',
            'schedule' => 'Schedule rule'
        ));

        $command = $schema->createModel('job_command', 'Job Command', array(
            'command' => 'Command',
            array('priority', 'integer', 'Priority')
        ));
        $command->hasOne($job);
        // $command->removeBehaviour('id');
        // var_dump($command->getProperties());
        // $command->setPk(array('id_job', 'priority'));

        $execution = $schema->createModel('job_execution', 'Job Execution', array(
            'dt_start' => 'Start date',
            'dt_end' => 'End date',
            array('success', 'integer', 'Success')
        ));
        $execution->hasOne($job);

        $log = $schema->createModel('job_log', 'Job log', array(
            'output' => 'Output',
            'dt_log' => 'Log date'
        ));
        $log->hasOne($execution);
    }
}