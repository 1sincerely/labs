<?php

use App\Controllers\HomeController;
use App\Controllers\OrderController;
use App\Controllers\DishController;

$router->get('/api/stats', [HomeController::class, 'index']);

$router->get('/api/orders', [OrderController::class, 'index']);
$router->get('/api/orders/{id}', [OrderController::class, 'show']);
$router->post('/api/orders', [OrderController::class, 'store']);
$router->put('/api/orders/{id}', [OrderController::class, 'update']);
$router->delete('/api/orders/{id}', [OrderController::class, 'destroy']);

$router->get('/api/dishes', [DishController::class, 'index']);
$router->get('/api/dishes/{id}', [DishController::class, 'show']);
$router->get('/api/dishes', [DishController::class, 'index']);
$router->get('/api/dishes/{id}', [DishController::class, 'show']);
$router->post('/api/dishes', [DishController::class, 'store']);
$router->put('/api/dishes/{id}', [DishController::class, 'update']);
$router->delete('/api/dishes/{id}', [DishController::class, 'destroy']);