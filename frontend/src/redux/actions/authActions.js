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
