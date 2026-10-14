<?php
$statusNames = [
    'new'     => 'Новый',
    'cooking' => 'Готовится',
    'ready'   => 'Готов',
    'paid'    => 'Оплачен',
];
/**
 * @var array $dish
 * @var array $orders
 */
?>
<p><a href="/dishes">← Ко всем проектам</a></p>

<div class="card">
  <h1><?= e($dish['name']) ?></h1>
  <p><?= e($dish['description']) ?></p>
</div>

<h2>Заказы с этим блюдом (<?= count($orders) ?>)</h2>

<?php if (count($orders) === 0): ?>
  <p class="empty">С этим блюдом пока нет заказов.</p>
<?php else: ?>
  <ul class="list">
    <?php foreach ($orders as $order): ?>
      <li>
        <a href="/orders/<?= e($order['id']) ?>"><?= e($order['client_name']) ?></a>
        <span class="badge badge-<?= e($order['status']) ?>"><?= e($statusNames[$order['status']] ?? $order['status']) ?></span>
      </li>
    <?php endforeach; ?>
  </ul>
<?php endif; ?>
