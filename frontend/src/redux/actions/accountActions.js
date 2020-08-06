import axios from 'axios';
import { fetchTransactions, fetchRecurringTransactions, pushFlashMessage, logout } from './'
import { currentUserId, getCsrfToken } from '../selectors';
import { generateCsrfHeader, isAuthError } from '../../utilities';

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

    const user_id = currentUserId(getState());
    axios
        .get(`/api/users/${user_id}/accounts`)
        .then(response => {
            dispatch(set_accounts(response.data.data))
            return getState().accounts;
        })
        // Fetch all transactions for the accounts
        .then(accounts => {
            for (let i=0; i < accounts.length; i++) {
                dispatch(fetchTransactions(accounts[i].id));
                dispatch(fetchRecurringTransactions(accounts[i].id));
            }
        })
        .catch(err => {
            console.log(err.response)
        })
};

export const postAccount = (accountAttrs) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .post(`/api/users/${user_id}/accounts`, 
              accountAttrs,
              generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(fetchAccounts());
            dispatch(pushFlashMessage(`Account ${accountAttrs.name} created`, 'success'));
            return {success: true};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`Account ${accountAttrs.name} could not be created`, 'error'));
            return {success: false, error: 'This account could not be created at this time'};
        })
};

export const patchAccount = (accountAttrs, accountId) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .patch(`/api/users/${user_id}/accounts/${accountId}`,
               accountAttrs,
               generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(updateAccount(accountId, accountAttrs));
            dispatch(pushFlashMessage(`Account ${accountAttrs.name} edited`, 'success'));
            return {success: true};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`Account ${accountAttrs.name} could not be edited`, 'error'));
            return {success: false, error: 'This account could not be updated at this time'};
        })
};

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export const updateAccount = (accountId, accountAttrs) => ({
    type: UPDATE_ACCOUNT,
    payload: {
        accountId,
        accountAttrs
    }
});

export const deleteAccount = (accountId, accountName) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .delete(`/api/users/${user_id}/accounts/${accountId}`,
                generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(fetchAccounts());
            dispatch(pushFlashMessage(`Account ${accountName} deleted`, 'success'));
            return {success: true};
        })
        .catch(err => {
            dispatch(pushFlashMessage(`Account could not be deleted`, 'error'));
            if (isAuthError(err)) { dispatch(logout(true)); }
            return {success: false, error: 'This account could not be deleted at this time'};
        })
};