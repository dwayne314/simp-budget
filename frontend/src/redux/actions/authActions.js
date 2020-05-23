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
    axios
        .post('/tokens', {}, {auth: authParams})
        .then(response => {
            applyAuthToken(response.data.token);
            dispatch(login(response.data.id));
            dispatch(fetchAccounts());
        })
        .catch(err => {
            const errorMsg = err.response;
            dispatch(login(undefined));

            if (typeof errorMsg === 'string') {
                dispatch(pushFlashMessage('Invalid username or password.', 'error'));
            }
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
            if (typeof errorMsg === 'string') {
                dispatch(pushFlashMessage(errorMsg, 'error'));
            }
            else {
                dispatch(setErrors(errorMsg));
            }
            return {success: false};
        })
};