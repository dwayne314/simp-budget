import axios from 'axios';


// 
// Account Actions 
//

export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const set_accounts = (accounts) => ({
    type: SET_ACCOUNTS,
    payload: {
        accounts
    }
})

export const fetchAccounts = () => (dispatch, getState) => {

    const currentUserId = getState().currentUserId;
    axios
        .get(`/users/${currentUserId}/accounts`)
        .then(response => {
            dispatch(set_accounts(response.data.data))
        })
        .catch(err => {
            console.log(err.response)
        })
};
