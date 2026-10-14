<?php
// app/Controllers/HomeController.php — контроллер главной страницы.

declare(strict_types=1);

namespace App\Controllers;

use App\Models\DishRepository;
use App\Models\OrderRepository;

final class HomeController
{
    // GET /
    public function index(): void
    {
        $orders = (new OrderRepository())->all();
        $dishes = (new DishRepository())->all();

        // Считаем, сколько задач в каждом статусе
        $byStatus = ['new' => 0, 'cooking' => 0, 'ready' => 0, 'paid' => 0];
        foreach ($orders as $order) {
            $byStatus[$order['status']]++;
        }

        view('home', [
            'title'         => 'Главная',
            'total'         => count($orders),
            'byStatus'      => $byStatus,
            'dishesCount' => count($dishes),
        ]);
    }
}
