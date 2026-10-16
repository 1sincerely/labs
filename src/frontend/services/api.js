async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };

    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const result = await fetch(path, options);

    if (result.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.hash = '#/login';
        throw new Error('Сессия истекла');
    }

    const data = result.status === 204 ? null : await result.json();

    if (!result.ok) throw new Error(data?.error || 'Ошибка: ' + result.status);

    return data;
}

export const api = {
    login(login, password) {
        return request('POST', '/api/auth/login', { login, password });
    },

    getStats() {
        return request('GET', '/api/stats');
    },

    getOrders(filters) {
        let base = '/api/orders';
        const searchParams = filters ? new URLSearchParams(filters).toString() : '';
        if (searchParams) base += '?' + searchParams;
        return request('GET', base);
    },

    getOrder(id) {
        return request('GET', '/api/orders/' + id);
    },

    createOrder(data) {
        return request('POST', '/api/orders', data);
    },

    updateOrderStatus(id, status) {
        return request('PUT', '/api/orders/' + id + '/status', { status });
    },

    deleteOrder(id) {
        return request('DELETE', '/api/orders/' + id);
    },

    getMenu() {
        return request('GET', '/api/dishes');
    },

    getClients() {
        return request('GET', '/api/clients');
    },
};