<?php
/**
 * @var array $dishes
 */
?>
<h1>Новая задача</h1>

<!-- action — адрес, на который браузер отправит данные; method="post" — способом POST -->
<form action="/orders" method="post" class="card form">

  <label for="client_name">Имя клиента</label>
  <input id="client_name" type="text" name="client_name" value="<?= e($old['client_name'] ?? '') ?>">
  <?php if (isset($errors['client_name'])): ?><div class="error"><?= e($errors['client_name']) ?></div><?php endif; ?>

  <label for="dish_id">Блюдо</label>
  <select id="dish_id" name="dish_id">
    <option value="">Выберите проект…</option>
    <?php foreach ($dishes as $dish): ?>
      <option value="<?= e($dish['id']) ?>" <?= ((int) ($old['dish_id'] ?? 0)) === $dish['id'] ? 'selected' : '' ?>>
        <?= e($dish['name']) ?>
      </option>
    <?php endforeach; ?>
  </select>
  <?php if (isset($errors['dish_id'])): ?><div class="error"><?= e($errors['dish_id']) ?></div><?php endif; ?>

  <label for="amount">Сумма заказа (₽)</label>
  <input id="amount" type="number" name="amount" value="<?= e($old['amount'] ?? '') 
  ?>">

  <p><button type="submit" class="btn">Создать задачу</button> <a href="/orders">Отмена</a></p>
</form>
