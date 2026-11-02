<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\DishRepository;
use App\Models\OrderRepository;

final class OrderController
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
        $status = $_GET['status'] ?? '';
        $orders = $this->orders->all();

        if ($status !== '') {
            $orders = array_values(array_filter(
                $orders,
                fn(array $o): bool => $o['status'] === $status
            ));
        }

        json(array_map([$this, 'format'], $orders));
    }

    public function show(string $id): void
    {
        $order = $this->orders->find((int) $id);
        if ($order === null) {
            notFound('Заказ не найден');
        }

        json($this->format($order));
    }

    public function store(): void
    {
        $data = body();

        $clientName = trim($data['clientName'] ?? $data['client_name'] ?? '');
        $dishId     = (int) ($data['dishId'] ?? $data['dish_id'] ?? 0);
        $total      = (int) ($data['total'] ?? $data['amount'] ?? 0);

        $errors = [];
        if (mb_strlen($clientName) < 3) {
            $errors['clientName'] = 'Имя клиента — не короче 3 символов';
        }
        if ($this->dishes->find($dishId) === null) {
            $errors['dishId'] = 'Выберите блюдо из списка';
        }
        if ($total <= 0) {
            $errors['total'] = 'Сумма должна быть больше нуля';
        }

        if ($errors) {
            json(['errors' => $errors], 422);
        }

        $order = $this->orders->add([
            'dish_id'     => $dishId,
            'client_name' => $clientName,
            'status'      => 'new',
            'amount'      => $total,
            'created_at'  => date('Y-m-d H:i'),
        ]);

        json($this->format($order), 201);
    }

    public function update(string $id): void
    {
        $order = $this->orders->find((int) $id);
        if ($order === null) {
            notFound('Заказ не найден');
        }

        $data = body();

        if (isset($data['status'])) {
            $allowed = ['new', 'cooking', 'ready', 'paid', 'cancelled'];
            if (!in_array($data['status'], $allowed, true)) {
                json(['errors' => ['status' => 'Недопустимый статус']], 422);
            }
            $order['status'] = $data['status'];
        }

        $order['updated_at'] = date('Y-m-d H:i');

        $this->orders->save($order);
        json($this->format($order));
    }

    public function destroy(string $id): void
    {
        $order = $this->orders->find((int) $id);
        if ($order === null) {
            notFound('Заказ не найден');
        }

        $this->orders->delete((int) $id);
        http_response_code(204);
        exit;
    }

    private function format(array $order): array
    {
        return [
            'id'         => $order['id'],
            'dishId'     => $order['dish_id'],
            'clientName' => $order['client_name'],
            'status'     => $order['status'],
            'total'      => $order['amount'],
            'createdAt'  => $order['created_at'],
        ];
    }
}