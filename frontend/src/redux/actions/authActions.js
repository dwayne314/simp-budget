export const LOGIN = 'LOGIN';

export const login = () => ({
    action: LOGIN,
    payload: {
        isLoggedIn: true
    }
})