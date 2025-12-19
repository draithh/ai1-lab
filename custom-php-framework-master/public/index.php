<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    case 'favorite-index':
        $controller = new \App\Controller\FavoriteController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'favorite-create':
        $controller = new \App\Controller\FavoriteController();
        $view = $controller->createAction($_REQUEST['favorite'] ?? null, $templating, $router);
        break;
    case 'favorite-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\FavoriteController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['favorite'] ?? null, $templating, $router);
        break;
    case 'favorite-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\FavoriteController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'favorite-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\FavoriteController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
