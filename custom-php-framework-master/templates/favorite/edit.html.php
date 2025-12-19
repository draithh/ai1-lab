<?php
/** @var \App\Model\Favorite $favorite */
/** @var \App\Service\Router $router */

$title = "Edit Favorite ({$favorite->getId()})";
$bodyClass = 'edit';

$posts = \App\Model\Post::findAll();

ob_start(); ?>
    <h1><?= $title ?></h1>

    <form action="<?= $router->generatePath('favorite-edit') ?>" method="post" class="edit-form">
        <fieldset>
            <legend>Wybierz post</legend>

            <?php if (count($posts) === 0): ?>
                <p>Brak postów do wyboru.</p>
            <?php else: ?>
                <ul class="select-list">
                    <?php foreach ($posts as $post):
                        $pid = $post->getId();
                        $inputId = 'post-' . $pid;
                        $checked = ($favorite->getPostId() && $favorite->getPostId() === $pid) ? 'checked' : '';
                    ?>
                        <li>
                            <input type="radio" id="<?= $inputId ?>" name="favorite[post_id]" value="<?= $pid ?>" <?= $checked ?>>
                            <label for="<?= $inputId ?>"><?= htmlspecialchars($post->getSubject(), ENT_QUOTES, 'UTF-8') ?></label>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </fieldset>

        <div class="form-actions">
            <button type="submit">Save</button>
            <input type="hidden" name="action" value="favorite-edit">
            <input type="hidden" name="id" value="<?= $favorite->getId() ?>">
        </div>
    </form>

    <a href="<?= $router->generatePath('favorite-index') ?>">Back to list</a>
    <form action="<?= $router->generatePath('favorite-delete') ?>" method="post">
        <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
        <input type="hidden" name="action" value="favorite-delete">
        <input type="hidden" name="id" value="<?= $favorite->getId() ?>">
    </form>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';