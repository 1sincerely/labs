async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };

    // for future: authorization with backend implemented
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const result = await fetch(path, options);
    if (result.status === 401) {
        localStorage.removeItem('token');
        location.hash = '#/login';
        throw new Error('Сессия истекла');
    };

    const data = result.status === 204 ? null : await result.json();

    if (!result.ok) throw new Error(data?.error || 'Ошибка: ' + result.status);

    return data;
}

export const api = {
    login(login, password) {
        const body = { login, password };
        return request('POST', '/api/auth/login', body);
    },
    getStats() {
        return request('GET', '/api/stats');
    },
    getOrders(filters) {
        let base = '/api/orders';
        const searchParams = (filters) ? new URLSearchParams(filters).toString() : '';
        if (searchParams) {
            base += '?' + searchParams;
        }
        return request('GET', base);
    }
}