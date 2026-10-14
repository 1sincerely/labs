<?php
$statusNames = [
    'new'     => 'Новый',
    'cooking' => 'Готовится',
    'ready'   => 'Готов',
    'paid'    => 'Оплачен',
];

/**
 * @var array $order
 * @var array $dish
 */
?>
<p><a href="/orders">← К списку заказов</a></p>

<div class="card">
  <h1>Заказ №<?= e($order['id']) ?></h1>
  <dl class="meta">
    <dt>Клиент</dt>   <dd><?= e($order['client_name']) ?></dd>
    <dt>Блюдо</dt>     <dd><a href="/dishes/<?= e($dish['id']) ?>"><?= e($dish['name']) ?></a></dd>
    <dt>Статус</dt>     <dd><span class="badge badge-<?= e($order['status']) ?>"><?= e($statusNames[$order['status']] ?? $order['status']) ?></span></dd>   
    <dt>Сумма</dt>      <dd><?= e($order['amount']) ?> ₽</dd>
    <dt>Дата</dt>       <dd><?= e($order['created_at']) ?></dd>
  </dl>
</div>
