<?php
/**
 * @var array $dishes
 */
?>
<h1>Блюда</h1>

<div class="grid">
  <?php foreach ($dishes as $dish): ?>
    <div class="card">
      <h3><a href="/dishes/<?= e($dish['id']) ?>"><?= e($dish['name']) ?></a></h3>
      <p><?= e($dish['description']) ?></p>
    </div>
  <?php endforeach; ?>
</div>
