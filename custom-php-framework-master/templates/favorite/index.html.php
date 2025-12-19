<?php

/** @var \App\Model\Favorite[] $favorites */
/** @var \App\Service\Router $router */

$title = 'Favorite List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Favorite List</h1>

    <a href="<?= $router->generatePath('favorite-create') ?>">Add new favorite</a>

    <ul class="index-list">
        <?php foreach ($favorites as $favorite):
            $postID = $favorite->getPostId();
            $post = \App\Model\Post::find($postID);
            $titleText = $post ? $post->getSubject() : 'Post Usuniety :('; ?>
            <li><h3><span style='color: gold'>&#9733;</span> <?= $titleText?></h3>(Post id: <?=$postID?>)
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('favorite-show', ['id' => $favorite->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('favorite-edit', ['id' => $favorite->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
