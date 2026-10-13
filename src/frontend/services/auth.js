export function save(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.hash = '#/login';
}

export function isLoggedIn() {
    return !!localStorage.getItem('token');
}

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

export function getRole() {
    const user = getUser();
    if (user) {
        return user.role || null;
    } else {
        return null;
    }
}