<?php
// app/Models/ProjectRepository.php — модель проектов. Устроена так же, как TaskRepository.

declare(strict_types=1);

namespace App\Models;

final class DishRepository
{
    private string $file;

    public function __construct()
    {
        $this->file = BASE_PATH . '/storage/dishes.json';
    }

    public function all(): array
    {
        return json_decode(file_get_contents($this->file), true) ?? [];
    }

    public function find(int $id): ?array
    {
        foreach ($this->all() as $dish) {
            if ($dish['id'] === $id) {
                return $dish;
            }
        }
        return null;
    }
     public function add(array $data): array
    {
        $dishes = $this->all();
        $ids = array_column($dishes, 'id');
        $dish = ['id' => ($ids ? max($ids) : 0) + 1] + $data;
        $dishes[] = $dish;

        file_put_contents(
            $this->file,
            json_encode($dishes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            LOCK_EX
        );
        return $dish;
    }

    public function save(array $dish): void
    {
        $dishes = $this->all();
        foreach ($dishes as $i => $d) {
            if ($d['id'] === $dish['id']) {
                $dishes[$i] = $dish;
                break;
            }
        }
        file_put_contents(
            $this->file,
            json_encode($dishes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            LOCK_EX
        );
    }

    public function delete(int $id): void
    {
        $dishes = $this->all();
        $dishes = array_values(array_filter(
            $dishes,
            fn(array $d): bool => $d['id'] !== $id
        ));
        file_put_contents(
            $this->file,
            json_encode($dishes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            LOCK_EX
        );
    }
}
