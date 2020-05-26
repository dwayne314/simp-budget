import { 
    LOGIN,
    SET_ACCOUNTS,
    SET_TRANSACTIONS,
    ADD_TRANSACTIONS,
    UPDATE_TRANSACTION,
    REMOVE_TRANSACTIONS,
    SET_FLASH_MESSAGES,
    PUSH_FLASH_MESSAGE,
    SET_ERRORS
} from '../actions'


const initialState = {
    currentUserId: null,
    accounts: [],
    transactions: [],
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

        case SET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload.transactions
            }

        case ADD_TRANSACTIONS:
            return {
                ...state,
                transactions: [...state.transactions, ...action.payload.transaction]
            }
        
        case UPDATE_TRANSACTION:
            const { transactionId, transactionAttrs} = action.payload;
            const updateKeys = Object.keys(transactionAttrs);
            return {
                ...state,
                transactions: state.transactions.map(tran => {
                    if (tran.id === Number(transactionId)) {
                        for (let i=0; i < updateKeys.length; i++) {
                            tran[updateKeys[i]] = transactionAttrs[updateKeys[i]];
                        }
                    }
                    return tran;
                })
            };

        case REMOVE_TRANSACTIONS:
            const { transactionIds } = action.payload
            return {
                ...state,
                transactions: state.transactions.filter(tran => transactionIds.indexOf(tran.id) === -1)
            }

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
