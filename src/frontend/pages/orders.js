import { api } from '../services/api.js';
import { auth } from '../services/auth.js';

export async function renderOrders() {
    const role = auth.getRole();

    window.renderLayout({
        active: 'orders',
        role,
        content: `
            <div class="page-head">
                <div class="page-title">Заказы</div>
                <button class="btn btn-primary" onclick="location.hash='#/orders/new'">
                    + Новый заказ
                </button>
            </div>
            <div class="filters">
                <select class="input input-sm" id="filter-status" style="width:180px;">
                    <option value="">Все статусы</option>
                    <option value="new">Принят</option>
                    <option value="cooking">Готовится</option>
                    <option value="ready">Готов</option>
                    <option value="paid">Оплачен</option>
                </select>
                <input class="input input-sm" id="filter-search"
                       style="margin-left:auto; width:280px;"
                       placeholder="Поиск...">
            </div>
            <div id="orders-table"><div class="loading">Загрузка...</div></div>
        `,
    });

    await loadOrders();

    let timer;
    document.getElementById('filter-status').addEventListener('change', loadOrders);
    document.getElementById('filter-search').addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(loadOrders, 300);
    });
}

async function loadOrders() {
    const status = document.getElementById('filter-status').value;
    const q = document.getElementById('filter-search').value;
    const el = document.getElementById('orders-table');

    el.innerHTML = '<div class="loading">Загрузка...</div>';

    try {
        const filters = {};
        if (status) filters.status = status;
        if (q) filters.q = q;

        const orders = await api.getOrders(filters);

        if (!orders.length) {
            el.innerHTML = '<div class="loading">Заказы не найдены</div>';
            return;
        }

        el.innerHTML = `
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr><th>№</th><th>Клиент</th><th>Сумма</th><th>Статус</th></tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr onclick="location.hash='#/orders/${o.id}'" style="cursor:pointer;">
                                <td>${o.id}</td>
                                <td>${o.clientName}</td>
                                <td>${o.total} ₽</td>
                                <td>${statusBadge(o.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        el.innerHTML = `<div class="loading">Ошибка: ${err.message}</div>`;
    }
}

function statusBadge(status) {
    const map = {
        new:       ['Новый',    'badge-light'],
        accepted:  ['Принят', 'badge-light'],
        cooking:   ['Готовится', 'badge-dark'],
        ready:     ['Готов',     'badge-mid'],
        paid:      ['Оплачен',   'badge-mid'],
        cancelled: ['Отменён',   'badge-light'],
    };
    const [label, cls] = map[status] || [status, 'badge-light'];
    return `<span class="badge ${cls}">${label}</span>`;
}