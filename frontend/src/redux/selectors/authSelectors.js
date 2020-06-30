export const getCurrentUser = state => state.currentUser;
export const currentUserId = state => state.currentUser.id;
export const getAuthTokenExpiration = state => state.currentUser.authTokenExpiration;
export const getCsrfToken = state => state.csrfToken;
