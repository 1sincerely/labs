import { api } from '../services/api.js';
import { auth } from '../services/auth.js';

export async function renderOrderView({ id }) {
    const role = auth.getRole();

    window.renderLayout({
        active: 'orders',
        role,
        content: '<div class="loading">Загрузка...</div>',
    });

    try {
        const order = await api.getOrder(id);
        renderOrder(order);
    } catch (err) {
        document.querySelector('.content').innerHTML =
            `<div class="loading">Ошибка: ${err.message}</div>`;
    }
}

function renderOrder(order) {
    const statuses = ['new', 'accepted', 'cooking', 'ready', 'served', 'paid'];

    document.querySelector('.content').innerHTML = `
        <div class="page-head">
            <div class="page-title">Заказ №${order.id}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn" onclick="location.hash='#/orders'">← Назад</button>
                <button class="btn" id="delete-order-btn" style="border-color:#8b1a1a; color:#8b1a1a;">
                    Удалить
                </button>
            </div>
        </div>

        <div class="card" style="margin-bottom:24px;">
            <div style="font-size:14px; padding:6px 0;">
                <span style="color:#666; display:inline-block; width:100px;">Клиент:</span>
                ${order.clientName}
            </div>
            <div style="font-size:14px; padding:6px 0;">
                <span style="color:#666; display:inline-block; width:100px;">Дата:</span>
                ${order.createdAt}
            </div>
            <div style="font-size:14px; padding:6px 0;">
                <span style="color:#666; display:inline-block; width:100px;">Статус:</span>
                <span id="status-badge">${statusBadge(order.status)}</span>
            </div>
            ${order.comment ? `
                <div style="font-size:14px; padding:6px 0;">
                    <span style="color:#666; display:inline-block; width:100px;">Комментарий:</span>
                    ${order.comment}
                </div>
            ` : ''}
        </div>

        <div style="font-size:16px; font-weight:600; margin-bottom:12px;">Состав заказа</div>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr><th>№</th><th>Блюдо</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
                </thead>
                <tbody>
                    ${order.items.map((item, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>
                                ${item.dishName}
                                ${item.notes ? `<br><span style="font-size:12px; color:#666;">${item.notes}</span>` : ''}
                            </td>
                            <td>${item.quantity}</td>
                            <td>${item.price} ₽</td>
                            <td>${item.quantity * item.price} ₽</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="total" style="font-size:20px; font-weight:700; margin:24px 0;">
            ИТОГО: ${order.total} ₽
        </div>

        <div style="font-size:16px; font-weight:600; margin-bottom:12px;">Изменить статус</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
            ${statuses.map(s => `
                <button class="btn btn-sm status-btn ${s === order.status ? 'btn-primary' : ''}"
                        data-status="${s}">
                    ${statusLabel(s)}
                </button>
            `).join('')}
        </div>
    `;

    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => changeStatus(order.id, btn.dataset.status));
    });

    document.getElementById('delete-order-btn').addEventListener('click', () => deleteOrder(order.id, order.clientName));
}

async function changeStatus(id, status) {
    try {
        await api.updateOrderStatus(id, status);
        window.showToast('Статус обновлён');

        document.querySelectorAll('.status-btn').forEach(b => {
            b.classList.toggle('btn-primary', b.dataset.status === status);
        });
        document.getElementById('status-badge').innerHTML = statusBadge(status);
    } catch (err) {
        window.showToast(err.message, 'error');
    }
}

async function deleteOrder(id, clientName) {
    const ok = confirm(`Удалить заказ №${id} (${clientName})?`);
    if (!ok) return;

    try {
        await api.deleteOrder(id);
        window.showToast('Заказ удалён');
        location.hash = '#/orders';
    } catch (err) {
        window.showToast(err.message, 'error');
    }
}

function statusLabel(s) {
    return {
        new:       'Новый',
        accepted:  'Принят',
        cooking:   'Готовится',
        ready:     'Готов',
        served:    'Выдан',
        paid:      'Оплачен',
    }[s] || s;
}

function statusBadge(status) {
    const map = {
        new:       ['Новый',    'badge-light'],
        accepted:  ['Принят',    'badge-light'],
        cooking:   ['Готовится', 'badge-dark'],
        ready:     ['Готов',     'badge-mid'],
        served:    ['Выдан',     'badge-mid'],
        paid:      ['Оплачен',   'badge-mid'],
        cancelled: ['Отменён',   'badge-light'],
    };
    const [label, cls] = map[status] || [status, 'badge-light'];
    return `<span class="badge ${cls}">${label}</span>`;
}