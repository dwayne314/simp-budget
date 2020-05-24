import axios from 'axios';
import { fetchAccounts, pushFlashMessage, setErrors } from './'
import { applyAuthToken } from '../../utilities';

// 
// Login Actions 
//

export const LOGIN = 'LOGIN';

export const login = (currentUserId) => ({
    type: LOGIN,
    payload: {
        currentUserId: currentUserId
    }
});

// Requests an auth token from the backend
export const fetchLogin = authParams => (dispatch, getState) => {
    return axios
        .post('/tokens', {}, {auth: authParams})
        .then(response => {
            applyAuthToken(response.data.token);
            dispatch(login(response.data.id));
            dispatch(fetchAccounts());

            return {success: true};

        })
        .catch(err => {
            dispatch(login(undefined));
            return {success: false, error: 'Authentication error: Invalid email/password'};
        })
};

// 
// Register Actions 
//

export const REGISTER = 'REGISTER';

export const fetchRegister = userData => dispatch => {
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