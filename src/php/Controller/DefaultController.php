<?php

namespace Controller;

use Build\Application;
use Cti\Core\Module\Web;
use Exception;

class DefaultController
{
    public function get(Application $application)
    {
        $layout = $application->getSencha()->createLayout();
        $layout->setScript('application')->display();
    }

    /**
     * if no method was found you can process request by yourself
     * chain is url pieces delimited by /
     * you can inject any parameter (thanks to di)
     * @param Web $web
     * @param array $chain
     */
    function processChain(Application $application, Web $web, $chain)
    {
        $application->getFenom()->display('url', array(
            'base' => $web->getUrl(),
            'request' => $web->getUrl(implode('/', $chain)),
        ));
    }

    /**
     * Catch request exceptions
     * @param Exception $e
     */
    function processException(Exception $e)
    {
        echo '<h4>Request error!</h4>', $e->getMessage();
    }
}