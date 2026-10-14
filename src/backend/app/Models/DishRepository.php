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
}
