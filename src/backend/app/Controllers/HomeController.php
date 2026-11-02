<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\DishRepository;
use App\Models\OrderRepository;

final class HomeController
{
    private OrderRepository $orders;
    private DishRepository $dishes;

    public function __construct()
    {
        $this->orders = new OrderRepository();
        $this->dishes = new DishRepository();
    }

    public function index(): void
    {
        $orders = $this->orders->all();
        $dishes = $this->dishes->all();

        $byStatus = ['new' => 0, 'cooking' => 0, 'ready' => 0, 'paid' => 0];
        foreach ($orders as $order) {
            if (isset($byStatus[$order['status']])) {
                $byStatus[$order['status']]++;
            }
        }

        json([
            'totalOrders' => count($orders),
            'totalDishes' => count($dishes),
            'byStatus'    => $byStatus,
        ]);
    }
}