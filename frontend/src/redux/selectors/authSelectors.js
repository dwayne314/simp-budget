export const getCurrentUser = state => state.currentUser;
export const currentUserId = state => state.currentUser.id;
export const getAuthToken = state => state.currentUser.authToken;
export const getAuthTokenExpiration = state => state.currentUser.authTokenExpiration;
