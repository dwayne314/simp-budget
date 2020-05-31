import axios from 'axios';
import { pushFlashMessage } from './';

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

export const postTransaction = ({amount, note, date}, accountId) => (dispatch, getState) => {
    const currentUserId = getState().currentUserId;
    return axios
        .post(`/users/${currentUserId}/accounts/${accountId}/transactions`, {amount, note, date})
        .then(response => {
            dispatch(pushFlashMessage('Transaction Created', 'success'));                      
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            return {success: false, error: 'This transaction could not be created at this time.'};
        })
};

export const patchTransaction = (transactionAttrs, accountId, transactionId) => (dispatch, getState) => {
    const currentUserId = getState().currentUserId;
    return axios
        .patch(`/users/${currentUserId}/accounts/${accountId}/transactions/${transactionId}`, transactionAttrs)
        .then(response => {
            dispatch(updateTransaction(transactionId, transactionAttrs));
            dispatch(pushFlashMessage('Transaction Updated', 'success'));            
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            return {success: false, error: 'This transaction could not be updated at this time.'};
        })
};

export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

export const updateTransaction = (transactionId, transactionAttrs) => ({
    type: UPDATE_TRANSACTION,
    payload: {
        transactionId,
        transactionAttrs
    }
});

export const REMOVE_TRANSACTIONS = 'REMOVE_TRANSACTIONS';

export const removeTransactions = (transactionIds) => ({
    type: REMOVE_TRANSACTIONS,
    payload: {
        transactionIds
    }
});

export const deleteTransactions = (transactionIds, accountId) => async (dispatch, getState) => {
    const currentUserId = getState().currentUserId;
    let deletedIds = [];
    let errorIds = [];

    const deleteTransaction = (transactionId) => {
        return axios
            .delete(`/users/${currentUserId}/accounts/${accountId}/transactions/${transactionId}`)
            .then(response => {
                dispatch(pushFlashMessage('Transaction Deleted', 'error'));                            
                return {success: true, transactionId};
            })
            .catch(err => {
                console.log(err)
                return {success: false, transactionId};
            })
    };

    for (let i=0; i < transactionIds.length; i++) {
        const deleteStatus = await deleteTransaction(transactionIds[i]);
        if (deleteStatus.success) {
            deletedIds.push(deleteStatus.transactionId);
        } else {
            errorIds.push(deleteStatus.transactionId);
        }
    }

    // Remove transactions from redux
    dispatch(removeTransactions(deletedIds))

    if (errorIds.length && !deletedIds.length) {
        return {success: false, error: 'These transactions could not be deleted at this time.'};
    } else if (errorIds.length && deletedIds.length) {
        return {success: false, error: 'Not all transactions could be deleted at this time.'};
    } else {
        return {success: true};
    }
};
