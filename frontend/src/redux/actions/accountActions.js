import axios from 'axios';
import { fetchTransactions } from './'

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
                dispatch(fetchTransactions(accounts[i].id));
            }
        })
        .catch(err => {
            console.log(err.response)
        })
};
