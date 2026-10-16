import { api } from '../services/api.js';
import { auth } from '../services/auth.js';

export async function renderHome() {
    const role = auth.getRole();
    const user = auth.getUser();

    window.renderLayout({
        active: 'home',
        role,
        content: `<div class="loading">Загрузка...</div>`,
    });

    try {
        const [stats, orders] = await Promise.all([
            api.getStats(),
            api.getOrders(),
        ]);

        const lastOrders = orders.slice(-5).reverse();

        document.querySelector('.content').innerHTML = `
            <div class="page-title">Добро пожаловать, ${user.name}!</div>

            <div class="stat-grid">
                <div class="stat">
                    <div class="stat-value">${stats.preparingOrders}</div>
                    <div class="stat-label">Готовится</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${stats.newOrders}</div>
                    <div class="stat-label">Новые</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${stats.paidOrders}</div>
                    <div class="stat-label">Оплачено</div>
                </div>
            </div>

            <div style="font-size:16px; font-weight:600; margin-bottom:12px;">
                Последние заказы
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>№</th><th>Клиент</th><th>Сумма</th><th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lastOrders.map(o => `
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
        document.querySelector('.content').innerHTML =
            `<div class="loading">Ошибка: ${err.message}</div>`;
    }
}

function statusBadge(status) {
    const map = {
        new:       ['Принят',    'badge-light'],
        cooking:   ['Готовится', 'badge-dark'],
        ready:     ['Готов',     'badge-mid'],
        paid:      ['Оплачен',   'badge-mid'],
        cancelled: ['Отменён',   'badge-light'],
    };
    const [label, cls] = map[status] || [status, 'badge-light'];
    return `<span class="badge ${cls}">${label}</span>`;
}