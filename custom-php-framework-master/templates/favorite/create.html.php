<?php
/** @var \App\Model\Favorite $favorite */
/** @var \App\Service\Router $router */

$title = 'Create Favorite';
$bodyClass = "edit";

$posts = \App\Model\Post::findAll();

ob_start(); ?>
    <h1>Add Favorite</h1>

    <form action="<?= $router->generatePath('favorite-create') ?>" method="post" class="edit-form">
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
            <button type="submit">Add</button>
            <input type="hidden" name="action" value="favorite-create">
        </div>
    </form>

    <a href="<?= $router->generatePath('favorite-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
