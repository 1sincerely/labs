<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\DishRepository;
use App\Models\OrderRepository;

final class DishController
{
    private DishRepository $dishes;
    private OrderRepository $orders;

    public function __construct()
    {
        $this->dishes = new DishRepository();
        $this->orders = new OrderRepository();
    }

    public function index(): void
    {
        $dishes = $this->dishes->all();
        json(array_map([$this, 'format'], $dishes));
    }

    public function show(string $id): void
    {
        $dish = $this->dishes->find((int) $id);
        if ($dish === null) {
            notFound('Блюдо не найдено');
        }

        $result = $this->format($dish);
        $result['orders'] = array_map(
            fn(array $o): array => [
                'id'         => $o['id'],
                'clientName' => $o['client_name'],
                'status'     => $o['status'],
                'total'      => $o['amount'],
                'createdAt'  => $o['created_at'],
            ],
            $this->orders->byDish((int) $id)
        );

        json($result);
    }

    public function store(): void
    {
        $data = body();

        $name        = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');
        $price       = (int) ($data['price'] ?? 0);

        $errors = [];
        if (mb_strlen($name) < 2) {
            $errors['name'] = 'Название — не короче 2 символов';
        }
        if ($price <= 0) {
            $errors['price'] = 'Цена должна быть больше нуля';
        }

        if ($errors) {
            json(['errors' => $errors], 422);
        }

        $dish = $this->dishes->add([
            'name'        => $name,
            'description' => $description,
            'price'       => $price,
        ]);

        json($this->format($dish), 201);
    }

    public function update(string $id): void
    {
        $dish = $this->dishes->find((int) $id);
        if ($dish === null) {
            notFound('Блюдо не найдено');
        }

        $data = body();

        if (isset($data['name'])) {
            $name = trim($data['name']);
            if (mb_strlen($name) < 2) {
                json(['errors' => ['name' => 'Название — не короче 2 символов']], 422);
            }
            $dish['name'] = $name;
        }

        if (isset($data['description'])) {
            $dish['description'] = trim($data['description']);
        }

        if (isset($data['price'])) {
            $price = (int) $data['price'];
            if ($price <= 0) {
                json(['errors' => ['price' => 'Цена должна быть больше нуля']], 422);
            }
            $dish['price'] = $price;
        }

        $this->dishes->save($dish);
        json($this->format($dish));
    }

    public function destroy(string $id): void
    {
        $dish = $this->dishes->find((int) $id);
        if ($dish === null) {
            notFound('Блюдо не найдено');
        }
        if (count($this->orders->byDish((int) $id)) > 0) {
            json(['error' => 'Нельзя удалить блюдо: есть связанные заказы'], 409);
        }
        $this->dishes->delete((int) $id);
        http_response_code(204);
        exit;
    }

    private function format(array $dish): array
    {
        return [
            'id'          => $dish['id'],
            'name'        => $dish['name'],
            'description' => $dish['description'],
            'price'       => $dish['price'],
        ];
    }
}