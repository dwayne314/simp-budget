import axios from 'axios';
import { pushFlashMessage, logout } from './';
import { currentUserId, getCsrfToken } from '../selectors';
import { generateCsrfHeader, isAuthError } from '../../utilities';


export const SET_RECURRING_TRANSACTIONS = 'SET_RECURRING_TRANSACTIONS';

export const setRecurringTransactions = (recurringTransactions) => ({
    type: SET_RECURRING_TRANSACTIONS,
    payload: {
        recurringTransactions
    }
});

export const postRecurringTransaction = (result, accountId) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .post(`/api/users/${user_id}/accounts/${accountId}/recurring_transactions`, 
              result, 
              generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(pushFlashMessage('Recurring transaction created', 'success'));
            return {success: true, recurringTransaction: response.data.data};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`This recurring transaction could not be created`, 'error'));
            console.log(err.response)
            return {success: false, error: 'This recurring transaction could not be created at this time.'};
        })
};

export const patchRecurringTransaction = (transactionAttrs, accountId, transactionId) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .patch(`/api/users/${user_id}/accounts/${accountId}/recurring_transactions/${transactionId}`,
               transactionAttrs,
               generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            // console.log(response)
            dispatch(updateRecurringTransaction(transactionId, transactionAttrs));
            dispatch(pushFlashMessage('Recurring transaction edited', 'success'));
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`This recurring transaction could not be edited`, 'error'));
            return {success: false, error: 'This recurring transaction could not be updated at this time.'};
        })
};

export const UPDATE_RECURRING_TRANSACTION = 'UPDATE_RECURRING_TRANSACTION';

export const updateRecurringTransaction = (recurringTransactionId, recurringTransactionAttrs) => ({
    type: UPDATE_RECURRING_TRANSACTION,
    payload: {
        recurringTransactionId,
        recurringTransactionAttrs
    }
});

export const fetchRecurringTransactions = accountId => (dispatch, getState) => {
    const user_id = currentUserId(getState());

    return axios
        .get(`/api/users/${user_id}/accounts/${accountId}/recurring_transactions`)
        .then(response => {
            dispatch(addRecurringTransactions(response.data.data))
        })
        .catch(err => {
            console.log(err.response)
        })
};

export const ADD_RECURRING_TRANSACTIONS = 'ADD_RECURRING_TRANSACTIONS';

export const addRecurringTransactions = (recurringTransaction) => ({
    type: ADD_RECURRING_TRANSACTIONS,
    payload: {
        recurringTransaction
    }
});

export const REMOVE_RECURRING_TRANSACTIONS = 'REMOVE_RECURRING_TRANSACTIONS';

export const removeRecurringTransactions = (recurringTransactionIds) => ({
    type: REMOVE_RECURRING_TRANSACTIONS,
    payload: {
        recurringTransactionIds
    }
});

export const deleteRecurringTransactions = (transactionIds, accountId) => async (dispatch, getState) => {
    const user_id = currentUserId(getState());
    let deletedIds = [];
    let errorIds = [];
    let authError = false;

    const deleteTransaction = (transactionId) => {
        return axios
            .delete(`/api/users/${user_id}/accounts/${accountId}/recurring_transactions/${transactionId}`,
                    generateCsrfHeader(getCsrfToken(getState())))
            .then(response => {
                dispatch(pushFlashMessage('Recurring transaction deleted', 'success'));
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
        // Remove recurring transactions from redux
        dispatch(removeRecurringTransactions(deletedIds.map(accountId => Number(accountId))));

        if (errorIds.length && !deletedIds.length) {
            return {success: false, error: 'These recurring transactions could not be deleted at this time.'};
        } else if (errorIds.length && deletedIds.length) {
            return {success: false, error: 'Not all recurring transactions could be deleted at this time.'};
        } else {
            return {success: true};
        }    
    }
    else {
        dispatch(logout(true));
        dispatch(pushFlashMessage(`This recurring transaction could not be deleted`, 'error'));
    }
    
};
