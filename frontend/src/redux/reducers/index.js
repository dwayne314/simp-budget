import { 
    LOGIN,
    SET_ACCOUNTS,
    SET_FLASH_MESSAGES,
    PUSH_FLASH_MESSAGE,
    SET_ERRORS
} from '../actions'


const initialState = {
    currentUserId: null,
    accounts: [],
    flashMessages: [],
    errors: {}
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
            return {
                ...state,
                flashMessages: [...state.flashMessages, {
                    message: action.payload.message,
                    messageType: action.payload.messageType
                }]
            };

        case SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors
            }
        default:
            return state
    };
};

export default rootReducer;
