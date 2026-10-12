export const categories = [
  { id: 1, name: 'Супы',    order: 1, active: true },
  { id: 2, name: 'Горячее', order: 2, active: true },
  { id: 3, name: 'Салаты',  order: 3, active: true },
  { id: 4, name: 'Напитки', order: 4, active: true },
  { id: 5, name: 'Десерты', order: 5, active: true },
];

export const dishes = [
  { id: 1, categoryId: 1, name: 'Борщ',           description: 'Свекла, капуста, говядина, сметана', price: 350, weight: 300, calories: 210, cookTime: 15, available: true },
  { id: 2, categoryId: 1, name: 'Солянка',         description: 'Мясной бульон, солёные огурцы, оливки', price: 400, weight: 350, calories: 260, cookTime: 15, available: true },
  { id: 3, categoryId: 1, name: 'Крем-суп',        description: 'Грибной, с трюфельным маслом',         price: 320, weight: 250, calories: 180, cookTime: 12, available: true },
  { id: 4, categoryId: 2, name: 'Стейк',           description: 'Говядина, средняя прожарка, соус',     price: 890, weight: 400, calories: 550, cookTime: 25, available: true },
  { id: 5, categoryId: 2, name: 'Паста карбонара', description: 'Спагетти, бекон, пармезан, яйцо',      price: 620, weight: 350, calories: 480, cookTime: 18, available: true },
  { id: 6, categoryId: 2, name: 'Куриное филе',    description: 'Гриль, овощи на пару',                 price: 540, weight: 300, calories: 320, cookTime: 20, available: true },
  { id: 7, categoryId: 3, name: 'Цезарь',          description: 'Курица, романо, пармезан, сухарики',   price: 420, weight: 250, calories: 290, cookTime: 10, available: true },
  { id: 8, categoryId: 3, name: 'Греческий',       description: 'Фета, оливки, огурец, томат',          price: 380, weight: 220, calories: 210, cookTime: 8,  available: false },
  { id: 9, categoryId: 4, name: 'Лимонад',         description: 'Домашний, мята, лайм, лёд',            price: 180, weight: 400, calories: 90,  cookTime: 5,  available: true },
  { id: 10, categoryId: 4, name: 'Кофе',           description: 'Эспрессо / американо / капучино',       price: 150, weight: 200, calories: 5,   cookTime: 3,  available: true },
  { id: 11, categoryId: 5, name: 'Чизкейк',        description: 'Нью-Йорк, с ягодным соусом',           price: 320, weight: 150, calories: 410, cookTime: 5,  available: true },
];

// ═══════════════════════════════════════════════════════════════
// СОТРУДНИКИ
// role: 'admin' | 'waiter' | 'cook' | 'barman'
// ═══════════════════════════════════════════════════════════════

export const users = [
  { id: 1, name: 'Администратор',    login: 'admin',  password: 'admin',  role: 'admin',  position: 'Менеджер',   active: true },
  { id: 2, name: 'Иван Петров',      login: 'ivan',   password: '12345',  role: 'waiter', position: 'Официант',   active: true },
  { id: 3, name: 'Мария Сидорова',   login: 'maria',  password: '12345',  role: 'cook',   position: 'Повар',      active: true },
  { id: 4, name: 'Алексей Смирнов',  login: 'alex',   password: '12345',  role: 'barman', position: 'Бармен',     active: true },
  { id: 5, name: 'Ольга Кузнецова',  login: 'olga',   password: '12345',  role: 'waiter', position: 'Официант',   active: false },
];

// ═══════════════════════════════════════════════════════════════
// КЛИЕНТЫ
// ═══════════════════════════════════════════════════════════════

export const clients = [
  { id: 1, name: 'Иванов И.И.',    phone: '+7 900 111-11-11', email: 'ivanov@mail.ru',   registeredAt: '2026-08-15' },
  { id: 2, name: 'Петров П.П.',    phone: '+7 900 222-22-22', email: 'petrov@mail.ru',   registeredAt: '2026-08-20' },
  { id: 3, name: 'Сидоров С.С.',   phone: '+7 900 333-33-33', email: 'sidorov@mail.ru',  registeredAt: '2026-09-01' },
  { id: 4, name: 'Кузнецов К.К.',  phone: '+7 900 444-44-44', email: 'kuznetsov@mail.ru',registeredAt: '2026-09-05' },
  { id: 5, name: 'Морозов М.М.',   phone: '+7 900 555-55-55', email: 'morozov@mail.ru',  registeredAt: '2026-09-07' },
];

// ═══════════════════════════════════════════════════════════════
// ЗАКАЗЫ
// status: 'new' | 'accepted' | 'cooking' | 'ready' | 'served' | 'paid' | 'cancelled'
// ═══════════════════════════════════════════════════════════════

export const orders = [
  {
    id: 101,
    clientId: 1,
    clientName: 'Иванов И.И.',
    waiterId: 2,
    waiterName: 'Иван Петров',
    status: 'cooking',
    total: 1590,
    comment: 'Без лука в салате',
    createdAt: '2026-09-08 12:30',
    updatedAt: '2026-09-08 12:35',
    items: [
      { dishId: 1, dishName: 'Борщ',  quantity: 2, price: 350, notes: 'острый' },
      { dishId: 4, dishName: 'Стейк', quantity: 1, price: 890, notes: '' },
    ],
  },
  {
    id: 102,
    clientId: 2,
    clientName: 'Петров П.П.',
    waiterId: 2,
    waiterName: 'Иван Петров',
    status: 'ready',
    total: 890,
    comment: '',
    createdAt: '2026-09-08 12:25',
    updatedAt: '2026-09-08 12:40',
    items: [
      { dishId: 4, dishName: 'Стейк', quantity: 1, price: 890, notes: '' },
    ],
  },
  {
    id: 103,
    clientId: 3,
    clientName: 'Сидоров С.С.',
    waiterId: 2,
    waiterName: 'Иван Петров',
    status: 'new',
    total: 2100,
    comment: 'Побыстрее, пожалуйста',
    createdAt: '2026-09-08 12:20',
    updatedAt: '2026-09-08 12:20',
    items: [
      { dishId: 4, dishName: 'Стейк',           quantity: 2, price: 890, notes: '' },
      { dishId: 11, dishName: 'Чизкейк',        quantity: 1, price: 320, notes: '' },
    ],
  },
  {
    id: 104,
    clientId: 4,
    clientName: 'Кузнецов К.К.',
    waiterId: 2,
    waiterName: 'Иван Петров',
    status: 'paid',
    total: 560,
    comment: '',
    createdAt: '2026-09-08 12:10',
    updatedAt: '2026-09-08 13:00',
    items: [
      { dishId: 7, dishName: 'Цезарь', quantity: 1, price: 420, notes: '' },
      { dishId: 10, dishName: 'Кофе',  quantity: 1, price: 140, notes: 'американо' },
    ],
  },
  {
    id: 105,
    clientId: 5,
    clientName: 'Морозов М.М.',
    waiterId: 2,
    waiterName: 'Иван Петров',
    status: 'cancelled',
    total: 1800,
    comment: 'Клиент ушёл',
    createdAt: '2026-09-08 11:55',
    updatedAt: '2026-09-08 12:15',
    items: [
      { dishId: 4, dishName: 'Стейк', quantity: 2, price: 890, notes: '' },
    ],
  },
];

export function reply(status, data) {
    return { __reply: true, status, data };
}

export function filterList(list, query) {
    return list.filter((item) => 
    Object.entries(query).every(([key, value]) => {
        if (value === '') return true;

        if (key === 'q') {
            const needle = value.toLowerCase();
            return Object.values(item).some(
                (v) => typeof v === 'string' && v.toLowerCase().includes(needle)
            );
        }

        return String(item[key]) === value;
    }))
}

export function now() {
    return new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')
}

export const ROUTES = {
    'GET /api/orders': (query) => filterList(orders, query),

    'GET /api/orders/:id': (query, body, params) => {
        const order = orders.find((o) => o.id === Number(params.id));
        if (!order) return reply(404, { error: 'Заказ не найден' });
        return order;
    },

    'POST /api/orders': (query, body, params) => {
        if (!body.items || body.items.length === 0) return reply(400, { error: 'Некорректные параметры' });

        const amount = body.items.reduce((sum, item) => {
            return sum + Number(item.price) * Number(item.quantity);
        }, 0);
        const client = clients.find((c) => c.id === Number(body.clientId));

        const newOrder = {
            id: counters.order++,
            clientId: client?.id ?? null,
            clientName: client?.name || 'Без имени',
            waiterId: 2,
            waiterName: 'Иван Петров',
            status: 'new',
            total: amount,
            comment: body.comment || '',
            createdAt: now(),
            updatedAt: now(),
            items: body.items,
        };

        orders.push(newOrder);
        return newOrder;
    },

    'PUT /api/orders/:id/status': (query, body, params) => {
      const order = orders.find((o) => o.id === Number(params.id));
      if (!order) return reply(404, { error: 'Заказ не найден' });

      const statuses = ['cooking', 'paid', 'new', 'accepted', 'ready', 'served', 'cancelled'];

      if (!statuses.includes(body.status)) return reply(400, { error: 'Некорректные параметры' });

      order.status = body.status;
      order.updatedAt = now();

      return order;
    },
    
    'GET /api/stats': (query) => {
      return {
        preparingOrders: orders.filter((o) => o.status === 'cooking').length,
        paidOrders: orders.filter((o) => o.status === 'paid').length,
        servedOrders: orders.filter((o) => o.status === 'served').length,
        cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
        acceptedOrders: orders.filter((o) => o.status === 'accepted').length,
        newOrders: orders.filter((o) => o.status === 'new').length,
        readyOrders: orders.filter((o) => o.status === 'ready').length 
      };
    },

    'GET /api/dishes': (query) => filterList(dishes, query),

    'GET /api/dishes/:id': (query, body, params) => {
      const dish = dishes.find((d) => d.id === Number(params.id));
      if (!dish) return reply(404, { error: 'Блюдо не найдено' });
      return dish;
    },

    'GET /api/categories': () => categories,

    'POST /api/dishes': (query, body, params) => {
      if (!body.name || body.price == null) return reply(400, { error: 'Некорректные параметры' });
      
      const newDish = {
        id: counters.dish++,
        categoryId: body.categoryId,
        name: body.name,
        description: body.description,
        price: body.price,
        weight: body.weight,
        calories: body.calories,
        cookTime: body.cookTime,
        available: true,   //TODO: add validation
      };

      dishes.push(newDish);

      return newDish;
    },
    
    'PUT /api/dishes/:id': (query, body, params) => {
      const dish = dishes.find((d) => d.id === Number(params.id));
      if (!dish) return reply(404, { error: 'Блюдо не найдено' });

      dish.categoryId =  body.categoryId ?? dish.categoryId;
      dish.name = body.name ?? dish.name;
      dish.description = body.description ?? dish.description;
      dish.price = body.price ?? dish.price;
      dish.weight = body.weight ?? dish.weight;
      dish.calories = body.calories ?? dish.calories;
      dish.cookTime = body.cookTime ?? dish.cookTime;
      dish.available = body.available ?? dish.available;

      return dish;

    },

    'DELETE /api/dishes/:id': (query, body, params) => {
      const index = dishes.findIndex((d) => d.id === Number(params.id));
      if (index === -1) return reply(404, { error: 'Блюдо не найдено'});

      const [deleted] = dishes.splice(index, 1);

      return deleted;
    },

    'POST /api/login' : () => {
      
    }

}