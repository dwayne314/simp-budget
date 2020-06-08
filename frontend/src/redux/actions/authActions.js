import axios from 'axios';
import {
    fetchAccounts,
    setErrors,
    pushFlashMessage,
    set_accounts,
    set_transactions,
    setFlashMessages
} from './'
import { isEmpty } from '../../utilities';

// 
// Login Actions 
//

export const LOGIN = 'LOGIN';

export const login = (currentUser, authToken) => {
    const currentUserWithExpiration = isEmpty(currentUser) ? 
        {} :
        Object.assign(
            currentUser, 
            {
                authTokenExpiration: new Date(currentUser.auth_token_expiration)
            })
    
    return {
        type: LOGIN,
        payload: {
            currentUser: currentUserWithExpiration
        }
    };
};

// Requests an auth token from the backend using Bear token auth
export const getToken = () => (dispatch, getState) => {
    
    return axios
        .get('/tokens')
        .then(response => {
            dispatch(login(response.data.user, response.data.token));
            return {success: true};
        })
        .catch(err => {
            // Logs the user out and clears transactions 
            dispatch(login({}));
            dispatch(set_transactions([]));
            return {success: false, error: 'Authentication error: Please login in'};
        })
}

// Requests an auth token from the backend using basic auth
export const postLogin = authParams => (dispatch, getState) => {
    return axios
        .post('/tokens', {}, {auth: authParams})
        .then(response => {
            dispatch(login(response.data.user, response.data.token));
            return response
        })
        .then(response => {
            dispatch(fetchAccounts());
            dispatch(pushFlashMessage('Welcome', 'success'));
            return {success: true};
        })
        .catch(err => {
            // Logs the user out and clears transactions             
            dispatch(login({}));
            dispatch(set_transactions([]));
            return {success: false, error: 'Authentication error: Invalid email/password'};
        })
};

// 
// Logout Actions
// 

export const logout = () => dispatch => {
    dispatch(login({}));
    dispatch(set_transactions([]));
    dispatch(set_accounts([]));
    dispatch(setFlashMessages([]));
};

// 
// Register Actions 
//

export const REGISTER = 'REGISTER';

export const postRegister = userData => dispatch => {
    return axios
        .post('/users', userData)
        .then(response => {
            dispatch(login(undefined));
            return {success: true};
        })
        .catch(err => {
            const errorMsg = err.response.data.error;
            dispatch(setErrors(errorMsg));
            return {success: false};
        })
};