import axios from 'axios';
import { fetchAccounts, setErrors } from './'
import { applyAuthToken } from '../../utilities';
import { pushFlashMessage } from './';

// 
// Login Actions 
//

export const LOGIN = 'LOGIN';

export const login = (currentUser) => ({
    type: LOGIN,
    payload: {
        currentUser: Object.assign(currentUser, {auth_token_expiration: new Date(currentUser.auth_token_expiration)})
    }
});

// Requests an auth token from the backend
export const postLogin = authParams => (dispatch, getState) => {
    alert()
    return axios
        .post('/tokens', {}, {auth: authParams})
        .then(response => {
            applyAuthToken(response.data.token);
            dispatch(login(response.data.user));
            dispatch(fetchAccounts());
            dispatch(pushFlashMessage('Welcome', 'success'))
            return {success: true};

        })
        .catch(err => {
            dispatch(login({}));
            return {success: false, error: 'Authentication error: Invalid email/password'};
        })
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