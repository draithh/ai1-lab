<?php
/** @var \App\Model\Favorite $favorite */
/** @var \App\Service\Router $router */

$post = \App\Model\Post::find($favorite->getPostId());

$title = $post ? "{$post->getSubject()} ({$post->getId()})" : "Ulubiony (post nieznany)";
$bodyClass = 'show';

ob_start(); ?>
    <?php if ($post): ?>
        <p class="favorite-badge">Moj ulubiony post: <span style='color: gold'>&#9733;</span><span style='color: gold'>&#9733;</span><span style='color: gold'>&#9733;</span></p>
        <h1> <?= htmlspecialchars($post->getSubject(), ENT_QUOTES, 'UTF-8') ?></h1>

        <article>
            <?= $post->getContent(); ?>
        </article>

        <ul class="action-list">
            <li><a href="<?= $router->generatePath('favorite-index') ?>">Back to favorites</a></li>
            <li><a href="<?= $router->generatePath('favorite-edit', ['id' => $favorite->getId()]) ?>">Edit favorite</a></li>
            <li><a href="<?= $router->generatePath('post-show', ['id' => $post->getId()]) ?>">Show post</a></li>
        </ul>
    <?php else: ?>
        <h1>Post usuniety :(</h1>
        <ul class="action-list">
            <li><a href="<?= $router->generatePath('favorite-index') ?>">Back to favorites</a></li>
            <li><a href="<?= $router->generatePath('favorite-edit', ['id' => $favorite->getId()]) ?>">Edit favorite</a></li>
        </ul>
    <?php endif; ?>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';