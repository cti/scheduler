<?php

namespace Scheduler;

use Storage\Master;
use Cti\Storage\Adapter\DBAL;

class Init
{
    function init(Master $master, DBAL $adapter)
    {
        if(!$master->getJobs()->findByPk(array('id_job' => 0))) {

            $job = $master->create('job', array(
                'name' => 'Scheduler',
                'status' => 'A',
                'system' => true,
            ));

            $job->save();
            $adapter->commit();
        }
    }
}