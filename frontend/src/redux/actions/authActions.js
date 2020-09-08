import axios from 'axios';
import Cookies from 'js-cookie';
import {
    fetchAccounts,
    setErrors,
    pushFlashMessage,
    set_accounts,
    set_transactions,
    setRecurringTransactions,
    setFlashMessages
} from './'
import { getCsrfToken } from '../selectors';
import { isEmpty, generateCsrfHeader } from '../../utilities';

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
        .get('/api/tokens')
        .then(response => {
            // Set CSRF Token
            const csrfToken = Cookies.get('csrf_token');
            dispatch(setCsrfToken(csrfToken));
            dispatch(login(response.data.user, response.data.token));
            return {success: true};
        })
        .catch(err => {
            // Logs the user out and clears transactions 
            dispatch(logout());
            return {success: false, error: 'Authentication error: Please login in'};
        })
}

// Requests an auth token from the backend using basic auth
export const postLogin = authParams => (dispatch, getState) => {
    return axios
        .post('/api/tokens', {}, {auth: authParams})
        .then(response => {
            // Set CSRF Token
            const csrfToken = Cookies.get('csrf_token');
            dispatch(setCsrfToken(csrfToken));
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
            dispatch(logout());
            return {success: false, error: 'Authentication error: Invalid email/password'};
        })
};

// 
// Logout Actions
// 

export const logout = (authError) => (dispatch, getState) => {
    // Reduces the calls to the api if the user's session has already timed out
    if (authError) {
        dispatch(set_transactions([]));
        dispatch(setRecurringTransactions([]));
        dispatch(set_accounts([]));
        dispatch(setFlashMessages([]));
        dispatch(login({}));
    }
    else {
        return axios
            .delete('/api/tokens', generateCsrfHeader(getCsrfToken(getState())))
            .then(response => {
                dispatch(login({}));
                dispatch(set_transactions([]));
                dispatch(setRecurringTransactions([]));
                dispatch(set_accounts([]));
                dispatch(setFlashMessages([]));
            })
            .catch(err => {
                dispatch(set_transactions([]));
                dispatch(setRecurringTransactions([]));
                dispatch(set_accounts([]));
                dispatch(setFlashMessages([]));
                dispatch(login({}));
            })
    }
};

// 
// Register Actions 
//

export const REGISTER = 'REGISTER';

export const postRegister = userData => dispatch => {
    return axios
        .post('/api/users', userData)
        .then(response => {
            dispatch(logout());
            dispatch(pushFlashMessage(`Please check your email for an account verification link`, 'success'));
            return {success: true};
        })
        .catch(err => {
            const errorMsg = err.response.data.error;
            dispatch(setErrors(errorMsg));
            return {success: false};
        })
};

//
// Email Verification Actions 
//

export const postVerifyEmail = webToken => dispatch => {
    return axios
        .post('/api/verifyEmail/'+webToken)
        .then(response => {
            dispatch(pushFlashMessage(`Email verified`, 'success'));
            dispatch(setEmailVerificationDate(new Date().toISOString()));
        })
        .catch(err => {
            dispatch(pushFlashMessage(`Email verification failure`, 'error'));            
        })
};

export const SET_EMAIL_VERIFICATION_DATE = 'SET_EMAIL_VERIFICATION_DATE';

export const setEmailVerificationDate = date => {
    return {
        type: SET_EMAIL_VERIFICATION_DATE,
        payload: {
            date: date
        }
    };
}

// 
// CSRF Tokens
// 

export const CSRF_TOKEN = 'CSRF_TOKEN';

export const setCsrfToken = token => {
    return {
        type: CSRF_TOKEN,
        payload: {
            csrfToken: token
        }
    };
};
