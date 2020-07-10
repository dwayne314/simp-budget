import axios from 'axios';
import { pushFlashMessage, logout } from './';
import { currentUserId, getCsrfToken } from '../selectors';
import { generateCsrfHeader, isAuthError } from '../../utilities';


export const postRecurringTransaction = (result, accountId) => (dispatch, getState) => {
    const user_id = currentUserId(getState());
    return axios
        .post(`/api/users/${user_id}/accounts/${accountId}/recurring_transactions`, 
              result, 
              generateCsrfHeader(getCsrfToken(getState())))
        .then(response => {
            dispatch(pushFlashMessage('Recurring transaction created', 'success'));
            return {success: true, transaction: response.data.data};
        })
        .catch(err => {
            if (isAuthError(err)) { dispatch(logout(true)); }
            dispatch(pushFlashMessage(`This recurring transaction could not be created`, 'error'));
            console.log(err.response)
            return {success: false, error: 'This recurring transaction could not be created at this time.'};
        })
};
