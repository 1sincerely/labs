<?php
// Шаблон главной страницы. Переменные приходят из HomeController::index():
//   $total (всего задач), $byStatus (массив «статус => количество»), $projectsCount
/**
 * @var int $total
 * @var array $byStatus
 * @var int $dishesCount
 */
?>
<h1>Главная</h1>

<div class="stats">
  <div class="card">
    <div class="stat-value"><?= e($total) ?></div>
    <div class="stat-label">всего заказов</div>
  </div>
  <div class="card">
    <div class="stat-value"><?= e($byStatus['new']) ?></div>
    <div class="stat-label">новых</div>
  </div>
  <div class="card">
    <div class="stat-value"><?= e($byStatus['cooking']) ?></div>
    <div class="stat-label">готовится</div>
  </div>
  <div class="card">
    <div class="stat-value"><?= e($byStatus['ready']) ?></div>
    <div class="stat-label">готово</div>
  </div>
</div>

<p>В системе <strong><?= e($dishesCount) ?></strong> блюд(а) Перейдите к <a href="/orders">списку заказов</a> или <a href="/dishes">блюдам</a>.</p>
