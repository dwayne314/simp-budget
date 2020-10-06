const isEmpty = (obj) => Object.keys(obj).length === 0;

const generateCsrfHeader= (value) => {
    
    let allHeaders = { headers: { 'X-CSRFToken': value} };

    return allHeaders;
};

const isAuthError = (err) => {
    const authErrorCode = [401, 403];
    return authErrorCode.includes(err.response.status);
};

const isProtectedRoute = (route) => {
    const unprotectedRoutes = ['/', '/login', '/register', '/sendPasswordReset', '/resetPassword'];
    return !unprotectedRoutes.includes(route);
}
    
export {
    isEmpty,
    generateCsrfHeader,
    isAuthError,
    isProtectedRoute
};
