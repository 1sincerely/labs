import { setupMockApi, mockApi } from './services/mocks/mock-api.js';
import { router } from './services/router.js';
import { renderLogin } from './pages/login.js';
import { renderHome } from './pages/home.js';
import { renderOrders } from './pages/orders.js';

setupMockApi();
window.MockApi = mockApi;

window.showToast = function (message, type = 'success') {
    const toast = document.getElementById('toast');
    const el = document.createElement('div');
    el.className = 'toast-item' + (type === 'error' ? ' error' : '');
    el.textContent = message;
    toast.appendChild(el);
    setTimeout(() => el.remove(), 3000);
};

window.renderLayout = function ({ active, role, content }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const sidebarItems = role === 'admin'
        ? [
            { id: 'home',      label: 'Главная',    hash: '#/' },
            { id: 'orders',    label: 'Заказы',     hash: '#/orders' },
            { id: 'menu',      label: 'Меню',       hash: '#/menu' },
            { id: 'employees', label: 'Сотрудники', hash: '#/admin/employees' },
            { id: 'reports',   label: 'Отчёты',     hash: '#/admin/reports' },
        ]
        : role === 'client'
        ? [
            { id: 'home',      label: 'Меню',       hash: '#/' },
            { id: 'my-orders', label: 'Мои заказы', hash: '#/client/my-orders' },
            { id: 'cart',      label: 'Корзина',    hash: '#/client/cart' },
        ]
        : [
            { id: 'home',   label: 'Главная', hash: '#/' },
            { id: 'orders', label: 'Заказы',  hash: '#/orders' },
            { id: 'menu',   label: 'Меню',    hash: '#/menu' },
        ];

    document.getElementById('app').innerHTML = `
        <div class="header">
            <div class="logo">RESTAURANT</div>
            <div class="header-right">
                <span style="font-size:14px; color:#666;">${user?.name || ''}</span>
                <button class="btn btn-sm" id="logout-btn">Выйти</button>
            </div>
        </div>
        <div class="layout">
            <div class="sidebar">
                ${sidebarItems.map(item => `
                    <a class="sidebar-item ${item.id === active ? 'active' : ''}"
                       href="${item.hash}">
                        ${item.label}
                    </a>
                `).join('')}
            </div>
            <div class="content">${content}</div>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.hash = '#/login';
    });
};

router
    .add('#/login', renderLogin)
    .add('#/', renderHome, { requiresAuth: true })
    .add('#/orders', renderOrders, { requiresAuth: true, roles: ['admin', 'waiter'] })
    .add('#/orders/new', async () => {
        const { renderOrderCreate } = await import('./pages/order-create.js');
        return renderOrderCreate();
    }, { requiresAuth: true, roles: ['admin', 'waiter'] })
    .add('#/orders/:id', async ({ id }) => {
        const { renderOrderView } = await import('./pages/order-view.js');
        return renderOrderView({ id });
    }, { requiresAuth: true });    

if (!location.hash) {
    location.hash = '#/login';
}
router.init();