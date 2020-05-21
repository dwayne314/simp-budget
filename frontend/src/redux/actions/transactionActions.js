import axios from 'axios';


// 
// Account Actions 
//

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export const set_transactions = (accounts) => ({
    type: SET_TRANSACTIONS,
    payload: {
        accounts
    }
});

export const fetchTransactions = (accountId) => (dispatch, getState) => {

    const currentUserId = getState().currentUserId;
    axios
        .get(`/users/${currentUserId}/accounts/${accountId}/transactions`)
        .then(response => {
            // dispatch(set_transactions(response.data.data))
            console.log(response.data.data)
            dispatch(add_transactions(response.data.data))
        })
        .catch(err => {
            console.log(err.response)
        })
};

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';

export const add_transactions = (transaction) => ({
    type: ADD_TRANSACTIONS,
    payload: {
        transaction
    }
});