export const auth = {
    save(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.hash = '#/login';
    },

    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    },

    getRole() {
        const user = auth.getUser();
        if (user) {
            return user.role || null;
        } else {
            return null;
        }
    },
}
