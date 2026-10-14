<?php
// routes/web.php — таблица маршрутов приложения: «какой адрес — какой контроллер и метод».
// Переменная $router создаётся в public/index.php.

use App\Controllers\OrderController;
use App\Controllers\DishController;
use App\Controllers\HomeController;

$router->get('/', [HomeController::class, 'index']);

$router->get('/orders', [OrderController::class, 'index']);
$router->get('/orders/create', [OrderController::class, 'create']);
$router->post('/orders', [OrderController::class, 'store']);
$router->get('/orders/{id}', [OrderController::class, 'show']);

$router->get('/dishes', [DishController::class, 'index']);
$router->get('/dishes/{id}', [DishController::class, 'show']);