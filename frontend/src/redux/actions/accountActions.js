import axios from 'axios';
import { postTransactions } from './'

// 
// Account Actions 
//

export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const set_accounts = (accounts) => ({
    type: SET_ACCOUNTS,
    payload: {
        accounts
    }
});

export const fetchAccounts = () => (dispatch, getState) => {

    const currentUserId = getState().currentUserId;
    axios
        .get(`/users/${currentUserId}/accounts`)
        .then(response => {
            dispatch(set_accounts(response.data.data))
            return getState().accounts
        })
        // Fetch all transactions for the accounts
        .then(accounts => {
            for (let i=0; i < accounts.length; i++) {
                dispatch(postTransactions(accounts[i].id));
            }
        })
        .catch(err => {
            console.log(err.response)
        })
};

export const postAccount = (accountAttrs) => (dispatch, getState) => {
    const currentUserId = getState().currentUserId;    
    return axios
        .post(`/users/${currentUserId}/accounts`, accountAttrs)
        .then(response => {
            dispatch(fetchAccounts());
            return {success: true};
        })
        .catch(err => {
            return {success: false, error: 'This account could not be created at this time'};
        })
};

export const patchAccount = (accountAttrs, accountId) => (dispatch, getState) => {
    const currentUserId = getState().currentUserId;    
    return axios
        .patch(`/users/${currentUserId}/accounts/${accountId}`, accountAttrs)
        .then(response => {
            dispatch(fetchAccounts());
            return {success: true};
        })
        .catch(err => {
            return {success: false, error: 'This account could not be updated at this time'};
        })
};