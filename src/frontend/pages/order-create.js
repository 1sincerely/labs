import { api } from '../services/api.js';
import { auth } from '../services/auth.js';

let cart = [];

export async function renderOrderCreate() {
    const role = auth.getRole();
    cart = [];

    window.renderLayout({
        active: 'orders',
        role,
        content: `
            <div class="page-head">
                <div class="page-title">Новый заказ</div>
                <button class="btn" onclick="location.hash='#/orders'">Отмена</button>
            </div>
            <div class="order-grid">
                <div class="panel">
                    <div class="panel-title">Блюда</div>
                    <input class="input input-sm" id="dish-search" placeholder="Поиск блюда...">
                    <div id="dishes-list"><div class="loading">Загрузка...</div></div>
                </div>
                <div class="panel">
                    <div class="panel-title">Корзина</div>
                    <div id="cart-list"></div>
                    <div style="margin-top:16px;">
                        <label class="field-label">Клиент</label>
                        <select class="input input-sm" id="client-select"></select>
                    </div>
                    <div>
                        <label class="field-label">Комментарий</label>
                        <textarea class="input" id="comment" placeholder="Особые пожелания..."></textarea>
                    </div>
                    <div class="total" id="cart-total">ИТОГО: 0 ₽</div>
                    <button class="btn btn-primary btn-block" id="create-btn" disabled>
                        Создать заказ
                    </button>
                </div>
            </div>
        `,
    });

    try {
        const [dishes, clients] = await Promise.all([
            api.getMenu(),
            api.getClients(),
        ]);

        renderDishes(dishes);
        renderClients(clients);
    } catch (err) {
        document.getElementById('dishes-list').innerHTML =
            `<div class="loading">Ошибка: ${err.message}</div>`;
    }

    document.getElementById('dish-search').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.dish-card').forEach(card => {
            card.style.display = card.dataset.name.toLowerCase().includes(q) ? '' : 'none';
        });
    });

    document.getElementById('create-btn').addEventListener('click', submitOrder);

    renderCart();
}

function renderDishes(dishes) {
    const list = document.getElementById('dishes-list');
    const available = dishes.filter(d => d.available);

    if (!available.length) {
        list.innerHTML = '<div class="loading">Нет доступных блюд</div>';
        return;
    }

    list.innerHTML = available.map(d => `
        <div class="dish-card" data-id="${d.id}" data-name="${d.name}" data-price="${d.price}">
            <div>
                <div class="dish-name">${d.name}</div>
                <div class="dish-price">${d.price} ₽ / ${d.weight} г</div>
            </div>
            <button class="btn btn-sm btn-primary add-dish-btn">+ Добавить</button>
        </div>
    `).join('');

    list.querySelectorAll('.add-dish-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.dish-card');
            addToCart({
                dishId: Number(card.dataset.id),
                dishName: card.dataset.name,
                price: Number(card.dataset.price),
                quantity: 1,
                notes: '',
            });
        });
    });
}

function renderClients(clients) {
    const select = document.getElementById('client-select');
    select.innerHTML = clients.map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('');
}

function addToCart(item) {
    const existing = cart.find(i => i.dishId === item.dishId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(item);
    }
    renderCart();
}

function renderCart() {
    const cartEl = document.getElementById('cart-list');

    if (!cart.length) {
        cartEl.innerHTML = '<div style="color:#666; font-size:14px; padding:12px 0;">Корзина пуста</div>';
    } else {
        cartEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <div>${item.dishName}</div>
                    <div style="font-size:12px; color:#666;">
                        ${item.quantity} × ${item.price} ₽
                    </div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button class="btn btn-sm qty-minus" data-id="${item.dishId}">−</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm qty-plus" data-id="${item.dishId}">+</button>
                    <button class="btn btn-sm remove-item" data-id="${item.dishId}">×</button>
                </div>
            </div>
        `).join('');

        cartEl.querySelectorAll('.qty-plus').forEach(b =>
            b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
        cartEl.querySelectorAll('.qty-minus').forEach(b =>
            b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
        cartEl.querySelectorAll('.remove-item').forEach(b =>
            b.addEventListener('click', () => removeItem(b.dataset.id)));
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    document.getElementById('cart-total').textContent = `ИТОГО: ${total} ₽`;
    document.getElementById('create-btn').disabled = cart.length === 0;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.dishId === Number(id));
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeItem(id);
    else renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.dishId !== Number(id));
    renderCart();
}

async function submitOrder() {
    const btn = document.getElementById('create-btn');
    btn.disabled = true;
    btn.textContent = 'Создание...';

    try {
        const order = await api.createOrder({
            clientId: Number(document.getElementById('client-select').value),
            comment: document.getElementById('comment').value,
            items: cart,
        });

        window.showToast('Заказ создан');
        location.hash = `#/orders/${order.id}`;
    } catch (err) {
        window.showToast(err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Создать заказ';
    }
}