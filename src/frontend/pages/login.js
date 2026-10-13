import { api } from '../services/api.js';
import { auth } from '../services/auth.js';

export function renderLogin() {
    document.getElementById('app').innerHTML = `
        <div class="login-wrap">
            <form class="login-card" id="login-form">
                <div class="login-title">RESTAURANT</div>
                <div>
                    <label class="field-label">Логин</label>
                    <input class="input" name="login" type="text" required autofocus>
                </div>
                <div>
                    <label class="field-label">Пароль</label>
                    <input class="input" name="password" type="password" required>
                </div>
                <button class="btn btn-primary btn-block" type="submit" id="login-btn">
                    ВОЙТИ
                </button>
                <div style="text-align:center; font-size:13px; color:#666; margin-top:8px;">
                    admin / admin
                </div>
            </form>
        </div>
    `;

    const form = document.getElementById('login-form');
    const btn = document.getElementById('login-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.textContent = 'Вход...';

        const login = form.login.value.trim();
        const password = form.password.value;

        try {
            const { token, user } = await api.login(login, password);
            auth.save(token, user);
            window.showToast('Добро пожаловать, ' + user.name);
            location.hash = '#/';
        } catch (err) {
            window.showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'ВОЙТИ';
        }
    });
}