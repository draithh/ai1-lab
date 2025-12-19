<?php
// php
namespace App\Model;

use App\Service\Config;

class Favorite
{
    private ?int $id = null;
    private ?int $postId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Favorite
    {
        $this->id = $id;
        return $this;
    }

    public function getPostId(): ?int
    {
        return $this->postId;
    }

    public function setPostId(?int $postId): Favorite
    {
        $this->postId = $postId;
        return $this;
    }

    public static function fromArray($array): Favorite
    {
        $favorite = new self();
        $favorite->fill($array);
        return $favorite;
    }

    public function fill($array): Favorite
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }

        // accept both post_id and postId keys
        if (isset($array['post_id'])) {
            $this->setPostId((int) $array['post_id']);
        } elseif (isset($array['postId'])) {
            $this->setPostId((int) $array['postId']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM favorite';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $items = [];
        $rows = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $items[] = self::fromArray($row);
        }

        return $items;
    }

    public static function find($id): ?Favorite
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM favorite WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $row) {
            return null;
        }

        return self::fromArray($row);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        if (! $this->getId()) {
            $sql = "INSERT INTO favorite (post_id) VALUES (:post_id)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'post_id' => $this->getPostId(),
            ]);
            $this->setId((int) $pdo->lastInsertId());
        } else {
            $sql = "UPDATE favorite SET post_id = :post_id WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':post_id' => $this->getPostId(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM favorite WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setPostId(null);
    }

    public static function existsForPostId(int $postId): bool
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT COUNT(*) FROM favorite WHERE post_id = :post_id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['post_id' => $postId]);
        $count = (int)$statement->fetchColumn();
        return $count > 0;
    }
}
