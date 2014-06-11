<?php

namespace Direct;

use Cti\Di\Manager;
use Storage\Repository\JobRepository;

class Scheduler
{
    /**
     * @inject
     * @var \Cti\Storage\Adapter\DBAL
     */
    protected $database;

    function createNew($name, JobRepository $repository) 
    {
        $repository->create(array(
            'name' => $name,
            'status' => 'N'
        ))->save();
        $this->database->commit();
    }

    function deleteJob($id_job, JobRepository $repository) 
    {
        $repository->findByPk(array('id_job' => $id_job))->delete();
        $this->database->commit();      
    }

    function getJobList(JobRepository $repository, Manager $manager)
    {
        $rows = array();
        foreach($repository->find(array(), 'many') as $item) {
            $rows[] = $item->asArray();
        }
        if(!count($rows)) {
            $initializer = $manager->create('Scheduler\Init');
            return $this->getJobList($repository, $manager);
        }
        return array('data' => $rows);
    }
}