<?php
// app/Controllers/orderController.php — контроллер задач: список, просмотр, создание.

declare(strict_types=1);

namespace App\Controllers;

use App\Models\OrderRepository;
use App\Models\DishRepository;

final class OrderController
{
    private OrderRepository $orders;
    private DishRepository $dishes;

    public function __construct()
    {
        $this->orders = new OrderRepository();
        $this->dishes = new DishRepository();
    }

    // GET /orders  или  GET /orders?status=done
    public function index(): void
    {
        $status = $_GET['status'] ?? '';          // параметр из адреса после «?»; если его нет — пустая строка
        $orders = $this->orders->all();

        if ($status !== '') {                     // фильтр по статусу
            $orders = array_values(array_filter($orders, fn(array $t): bool => $t['status'] === $status));
        }

        view('orders/index', [
            'title'  => 'Задачи',
            'orders'  => $orders,
            'status' => $status,
        ]);
    }

    // GET /orders/5   (значение {id} из маршрута приходит в параметр $id)
    public function show(string $id): void
    {
        $order = $this->orders->find((int) $id);
        if ($order === null) {
            notFound();                           // такой задачи нет: страница 404
        }

        view('orders/show', [
            'client_name'   => $order['client_name'],
            'order'    => $order,
            'dish' => $this->dishes->find($order['dish_id']),
        ]);
    }

    // GET /orders/create — форма создания
    public function create(): void
    {
        view('orders/create', [
            'title'    => 'Новая задача',
            'dishes' => $this->dishes->all(),
            'errors'   => [],
            'old'      => [],
        ]);
    }

    // POST /orders — обработка формы
    public function store(): void
    {
        // Данные формы приходят в массиве $_POST
        $clientName = trim($_POST['client_name'] ?? '');
        $dishId = (int) ($_POST['dish_id'] ?? 0);
        $amount = (int) ($_POST['amount'] ?? 0);

        // Проверка данных на сервере (клиентской проверке доверять нельзя)
        $errors = [];
        if (mb_strlen($clientName) < 3) {
            $errors['client_name'] = 'Название — не короче 3 символов';
        }
        if ($this->dishes->find($dishId) === null) {
            $errors['dish_id'] = 'Выберите блюдо из списка';
        }
        if ($amount <= 0) {
            $errors['priority'] = 'Недопустимое количество блюд';
        }

        if ($errors) {
            http_response_code(422);              // 422: данные не прошли проверку
            view('orders/create', [
                'title'    => 'Новая задача',
                'dishes' => $this->dishes->all(),
                'errors'   => $errors,
                'old'      => $_POST,             // вернуть в форму то, что ввёл пользователь
            ]);
            return;
        }

        $this->orders->add([
            'dish_id'     => $dishId,
            'client_name' => $clientName,
            'status'      => 'new',
            'amount'      => $amount,
            'created_at'  => date('Y-m-d H:i'),
        ]);

        redirect('/orders');                       // после успешной отправки формы — переход на список
    }
}
