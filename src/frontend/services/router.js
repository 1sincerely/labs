import { auth } from './auth.js';

export const router = {
    routes: [],

    add(pattern, handler, options = {}) {
        this.routes.push({ pattern, handler, options });
        return this;
    },

    match(pattern, hash) {
        const paramNames = [];
        const regexp = pattern.replace(/:([A-Za-z]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });

        const m = hash.match(new RegExp('^' + regexp + '$'));
        if (!m) return null;

        const params = {};
        paramNames.forEach((name, i) => {
            params[name] = m[i + 1];
        });

        return { params };
    },

    async resolve() {
        const hash = location.hash || '#/login';

        for (const route of this.routes) {
            const m = this.match(route.pattern, hash);
            if (!m) continue;

            if (route.options.requiresAuth && !auth.isLoggedIn()) {
                location.hash = '#/login';
                return;
            }

            if (route.options.roles) {
                const role = auth.getRole();
                if (!route.options.roles.includes(role)) {
                    location.hash = '#/';
                    return;
                }
            }

            try {
                await route.handler(m.params);
            } catch (err) {
                console.error('Ошибка в handler:', err);
                document.getElementById('app').innerHTML =
                    `<div style="padding:40px; text-align:center;">
                        <h2>Ошибка</h2>
                        <p>${err.message}</p>
                    </div>`;
            }
            return;
        }

        document.getElementById('app').innerHTML = `
            <div style="padding:80px; text-align:center;">
                <h1 style="font-size:48px;">404</h1>
                <p style="color:#666;">Страница не найдена</p>
                <a href="#/" style="color:#000;">На главную</a>
            </div>
        `;
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    },
};