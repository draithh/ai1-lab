<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Favorite;
use App\Service\Router;
use App\Service\Templating;

class FavoriteController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $favorites = Favorite::findAll();
        $html = $templating->render('favorite/index.html.php', [
            'favorites' => $favorites,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $favorite = Favorite::fromArray($requestPost);
            // @todo missing validation
            if (! $favorite->getPostId()) {
                throw new \InvalidArgumentException('postId is required');
            }
            if (! \App\Model\Post::find($favorite->getPostId())) {
                throw new \InvalidArgumentException('The postId does not exist');
            }
            if (Favorite::existsForPostId($favorite->getPostId())) {
                throw new \InvalidArgumentException('This post is already in favorites');
            }
            $favorite->save();

            $path = $router->generatePath('favorite-index');
            $router->redirect($path);
            return null;
        } else {
            $favorite = new Favorite();
        }

        $html = $templating->render('favorite/create.html.php', [
            'favorite' => $favorite,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $favoriteId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $favorite = Favorite::find($favoriteId);
        if (! $favorite) {
            throw new NotFoundException("Missing favorite with id $favoriteId");
        }

        if ($requestPost) {
            $favorite->fill($requestPost);
            // @todo missing validation
            if (! $favorite->getPostId()) {
                throw new \InvalidArgumentException('postId is required');
            }
            if (! \App\Model\Post::find($favorite->getPostId())) {
                throw new \InvalidArgumentException('The postId does not exist');
            }
            if (Favorite::existsForPostId($favorite->getPostId())) {
                throw new \InvalidArgumentException('This post is already in favorites');
            }
            $favorite->save();

            $path = $router->generatePath('favorite-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('favorite/edit.html.php', [
            'favorite' => $favorite,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $favoriteId, Templating $templating, Router $router): ?string
    {
        $favorite = Favorite::find($favoriteId);
        if (! $favorite) {
            throw new NotFoundException("Missing favorite with id $favoriteId");
        }

        $html = $templating->render('favorite/show.html.php', [
            'favorite' => $favorite,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $favoriteId, Router $router): ?string
    {
        $favorite = Favorite::find($favoriteId);
        if (! $favorite) {
            throw new NotFoundException("Missing favorite with id $favoriteId");
        }

        $favorite->delete();
        $path = $router->generatePath('favorite-index');
        $router->redirect($path);
        return null;
    }
}