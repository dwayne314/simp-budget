import axios from 'axios';
import { fetchAccounts } from './'
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
export const fetchLogin = authParams => dispatch => {
    axios
        .post('/tokens', {}, {auth: authParams})
        .then(response => {
            applyAuthToken(response.data.token)   
            dispatch(login(response.data.id));
            dispatch(fetchAccounts())
        })
        .catch(err => {
            dispatch(login(undefined));
        })
};

// 
// Register Actions 
//

export const REGISTER = 'REGISTER';

export const fetchRegister = userData => dispatch => {
    axios
        .post('/users', userData)
        .then(response => {
            dispatch(login(undefined));
        })
        .catch(err => {
            console.log(err.response.data.error)
        })
};