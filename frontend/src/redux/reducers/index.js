import { LOGIN, SET_ACCOUNTS } from '../actions'

const initialState = {
    currentUserId: null,
    accounts: [],
};

const rootReducer = (state=initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                currentUserId: action.payload.currentUserId
            };

        case SET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload.accounts
            }
        default:
            return state
    };
};

export default rootReducer;
