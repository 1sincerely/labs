# Лабораторная работа №7. Проектирование REST API

## Цель работы

Изучить принципы проектирования REST API, разработать набор ресурсов информационной системы, реализовать основные HTTP-методы, подготовить документацию API и выполнить тестирование запросов.

## Ресурсы системы

| Ресурс | URL | Методы | Назначение | Формат данных |
| --- | --- | --- | --- | --- |
| Заказы | `/api/orders`, `/api/orders/{id}` | GET, POST, PUT, DELETE | учёт заказов ресторана | JSON: `id`, `dishId`, `clientName`, `status`, `total`, `createdAt` |
| Блюда | `/api/dishes`, `/api/dishes/{id}` | GET, POST, PUT, DELETE | меню ресторана | JSON: `id`, `name`, `description`, `price` |
| Статистика | `/api/stats` | GET | агрегированные данные по заказам и блюдам | JSON: `totalOrders`, `totalDishes`, `byStatus` |

## Обзор API

| Метод | URL | Назначение | Успешный код |
| --- | --- | --- | --- |
| GET | `/api/orders` | Список заказов (фильтр `?status=`) | 200 |
| GET | `/api/orders/{id}` | Заказ по номеру | 200 |
| POST | `/api/orders` | Создать заказ | 201 |
| PUT | `/api/orders/{id}` | Изменить заказ | 200 |
| DELETE | `/api/orders/{id}` | Удалить заказ | 204 |
| GET | `/api/dishes` | Список блюд | 200 |
| GET | `/api/dishes/{id}` | Блюдо по номеру (связанные заказы) | 200 |
| POST | `/api/dishes` | Создать блюдо | 201 |
| PUT | `/api/dishes/{id}` | Изменить блюдо | 200 |
| DELETE | `/api/dishes/{id}` | Удалить блюдо | 204 |
| GET | `/api/stats` | Статистика по заказам и блюдам | 200 |

## Коды ответов

| Код | Когда используется |
| --- | --- |
| **200** | Успешный запрос |
| **201** | Ресурс создан |
| **204** | Успешно, нет содержимого (удаление) |
| **400** | Некорректный JSON в теле запроса |
| **404** | Ресурс не найден |
| **405** | Метод не разрешён для этого URL |
| **422** | Ошибка валидации данных |
| **500** | Внутренняя ошибка сервера |

## Примеры запросов и ответов

### GET api/orders
```
curl -i http://localhost:8000/api/orders
```
```
[
    { "id": 1, "dishId": 1, "clientName": "Иванов И.И.", "status": "new", "total": 700, "createdAt": "2026-09-08 12:30" },
    { "id": 2, "dishId": 3, "clientName": "Петров П.П.", "status": "cooking", "total": 890, "createdAt": "2026-09-08 12:25" }
]
```

### GET api/orders/1
```
curl -i http://localhost:8000/api/orders/1
```
### GET api/dishes
```
curl -i http://localhost:8000/api/dishes
```
```
[
    { "id": 1, "name": "Борщ", "description": "Свекла, капуста, говядина", "price": 350 },
    { "id": 2, "name": "Солянка", "description": "Мясной бульон, оливки", "price": 400 }
]
```

###  GET api/stats
```
curl -i http://localhost:8000/api/stats
```
```
{
    "totalOrders": 5,
    "totalDishes": 5,
    "byStatus": { "new": 1, "cooking": 2, "ready": 1, "paid": 1 }
}
```
## Ошибки

| **400** | Некорректный JSON в теле запроса |
| **404** | Ресурс не найден |
| **405** | Метод не разрешён для этого URL |
| **422** | Ошибка валидации данных |
| **500** | Внутренняя ошибка сервера |

## Тестирование API
| № | Запрос | Ожидаемый код | Получен код | Комментарий |
| --- | --- | --- | --- | --- |
| 1 | GET /api/orders | 200 | 200 | Массив из 5 заказов |
| 2 | GET /api/orders?status=cooking | 200 | 200 | Массив из 2 заказов (только cooking) |
| 3 | GET /api/orders/1 | 200 | 200 | Один заказ, объект с полями |
| 4 | GET /api/orders/999 | 404 | 404 | `{ "error": "Заказ не найден" }` |
| 5 | POST /api/orders (корректное тело) | 201 | 201 | Создан заказ с id=6 |
| 6 | POST /api/orders (короткое имя) | 422 | 422 | Объект `errors` с полями |
| 7 | POST /api/orders (тело "abc") | 400 | 400 | `{ "error": "Тело запроса не является корректным JSON" }` |
| 8 | PUT /api/orders/1 (status=ready) | 200 | 200 | Статус обновлён |
| 9 | PUT /api/orders/1 (status=invalid) | 422 | 422 | `errors.status` |
| 10 | PUT /api/orders/999 | 404 | 404 | Заказ не найден |
| 11 | DELETE /api/orders/6 | 204 | 204 | Пустое тело |
| 12 | DELETE /api/orders/999 | 404 | 404 | Заказ не найден |
| 13 | DELETE /api/orders (без id) | 405 | 405 | Заголовок `Allow: GET, POST` |
| 14 | GET /api/dishes | 200 | 200 | Массив из 5 блюд |
| 15 | GET /api/dishes/1 | 200 | 200 | Блюдо + связанные заказы |
| 16 | GET /api/dishes/999 | 404 | 404 | Блюдо не найдено |
| 17 | POST /api/dishes (корректное тело) | 201 | 201 | Создано блюдо с id=6 |
| 18 | POST /api/dishes (короткое имя) | 422 | 422 | Ошибки валидации |
| 19 | PUT /api/dishes/1 (price=400) | 200 | 200 | Цена обновлена |
| 20 | DELETE /api/dishes/6 | 204 | 204 | Пустое тело |
| 21 | GET /api/stats | 200 | 200 | Объект: totalOrders, totalDishes, byStatus |