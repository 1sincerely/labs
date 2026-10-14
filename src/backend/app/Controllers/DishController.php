<?php
// app/Controllers/dishController.php — контроллер проектов: список и просмотр проекта с его задачами.

declare(strict_types=1);

namespace App\Controllers;

use App\Models\DishRepository;
use App\Models\OrderRepository;

final class DishController
{
    // GET /dishs
    public function index(): void
    {
        view('dishes/index', [
            'title'    => 'Блюда',
            'dishes' => (new DishRepository())->all(),
        ]);
    }

    // GET /dishs/2
    public function show(string $id): void
    {
        $dish = (new DishRepository())->find((int) $id);
        if ($dish === null) {
            notFound();
        }

        view('dishes/show', [
            'id'   => $dish['id'],
            'dish' => $dish,
            'orders'   => (new OrderRepository())->byDish($dish['id']),
        ]);
    }
}
