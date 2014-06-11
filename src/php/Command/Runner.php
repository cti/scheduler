<?php

namespace Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Runner extends Command
{
    /**
     * @inject
     * @var \Build\Application
     */
    protected $application;

    protected function configure()
    {
        $this
            ->setName('scheduler:runner')
            ->setDescription('Run scheduled tasks')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->application->getManager()->get('Scheduler\Runner');
    }
} 