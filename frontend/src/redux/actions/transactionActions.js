import axios from 'axios';
import { pushFlashMessage, logout } from './';
import { currentUserId, getCsrfToken } from '../selectors';
import { generateCsrfHeader, isAuthError } from '../../utilities';

// 
// Account Actions 
//

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export const set_transactions = (transactions) => ({
    type: SET_TRANSACTIONS,
    payload: {
        transactions
    }
});

export const fetchTransactions = (accountId) => (dispatch, getState) => {

    const user_id = currentUserId(getState());
    axios
        .get(`/api/users/${user_id}/accounts/${accountId}/transactions`)
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
    const user_id = currentUserId(getState());
    return axios
        .post(`/api/users/${user_id}/accounts/${accountId}/transactions`, 
              {amount, note, date}, 
              generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(pushFlashMessage('Transaction created', 'success'));
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`This transaction could not be created`, 'error'));
            return {success: false, error: 'This transaction could not be created at this time.'};
        })
};

export const patchTransaction = (transactionAttrs, accountId, transactionId) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .patch(`/api/users/${user_id}/accounts/${accountId}/transactions/${transactionId}`,
               transactionAttrs,
               generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(updateTransaction(transactionId, transactionAttrs));
            dispatch(pushFlashMessage('Transaction edited', 'success'));
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`This transaction could not be edited`, 'error'));
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
    const user_id = currentUserId(getState());
    let deletedIds = [];
    let errorIds = [];
    let authError = false;

    const deleteTransaction = (transactionId) => {
        return axios
            .delete(`/api/users/${user_id}/accounts/${accountId}/transactions/${transactionId}`,
                    generateCsrfHeader(getCsrfToken(getState())))
            .then(response => {
                dispatch(pushFlashMessage('Transaction deleted', 'success'));
                return {success: true, transactionId};
            })
            .catch(err => {
                return {success: false, transactionId, authError:isAuthError(err)};
            })
    };

    for (let i=0; i < transactionIds.length; i++) {
        const deleteStatus = await deleteTransaction(transactionIds[i]);
        if (deleteStatus.success) {
            deletedIds.push(deleteStatus.transactionId);
        } else {
            if (deleteStatus.authError) {
                authError = true;
            }
            errorIds.push(deleteStatus.transactionId);
        }
    }

    if (!authError) {
        // Remove transactions from redux
        dispatch(removeTransactions(deletedIds.map(accountId => Number(accountId))));
        if (errorIds.length && !deletedIds.length) {
            return {success: false, error: 'These transactions could not be deleted at this time.'};
        } else if (errorIds.length && deletedIds.length) {
            return {success: false, error: 'Not all transactions could be deleted at this time.'};
        } else {
            return {success: true};
        }    
    }
    else {
        dispatch(logout(true));
        dispatch(pushFlashMessage(`This transaction could not be deleted`, 'error'));
    }
    
};
