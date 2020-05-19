import { LOGIN, SET_ACCOUNTS, SET_FLASH_MESSAGES, PUSH_FLASH_MESSAGE } from '../actions'

const initialState = {
    currentUserId: null,
    accounts: [],
    flashMessages: [],
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
            };

        case SET_FLASH_MESSAGES:
            return {
                ...state,
                flashMessages: action.payload.messages
            };

        case PUSH_FLASH_MESSAGE:
        console.log(state)
            return {
                ...state,
                flashMessages: [...state.flashMessages, {
                    message: action.payload.message,
                    messageType: action.payload.messageType
                }]
            };
        default:
            return state
    };
};

export default rootReducer;
