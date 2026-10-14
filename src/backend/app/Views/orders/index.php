<?php
$statusNames = [
    'new'     => 'Новый',
    'cooking' => 'Готовится',
    'ready'   => 'Готов',
    'paid'    => 'Оплачен',
];

/**
 * @var array $orders
 * @var string $status
 */
?>
<h1>Заказы</h1>

<p class="filters">
  Показать:
  <a href="/orders" class="<?= $status === '' ? 'active' : '' ?>">все</a>
  <?php foreach ($statusNames as $code => $name): ?>
    <a href="/orders?status=<?= e($code) ?>" class="<?= $status === $code ? 'active' : '' ?>"><?= e($name) ?></a>
  <?php endforeach; ?>
</p>

<?php if (count($orders) === 0): ?>
  <p class="empty">Заказов нет.</p>
<?php else: ?>
  <table>
    <thead>
      <tr><th>№</th><th>Имя клиента</th><th>Статус</th><th>Сумма</th></tr>
    </thead>
    <tbody>
      <?php foreach ($orders as $order): ?>
        <tr>
          <td><?= e($order['id']) ?></td>
          <td><a href="/orders/<?= e($order['id']) ?>"><?= e($order['client_name']) ?></a></td>
          <td><span class="badge badge-<?= e($order['status']) ?>"><?= e($statusNames[$order['status']] ?? $order['status']) ?></span></td>
          <td><?= e($order['amount'] ?? '—') ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
<?php endif; ?>
