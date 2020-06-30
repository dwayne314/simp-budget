import { 
    LOGIN,
    CSRF_TOKEN,
    SET_ACCOUNTS,
    UPDATE_ACCOUNT,
    SET_TRANSACTIONS,
    ADD_TRANSACTIONS,
    UPDATE_TRANSACTION,
    REMOVE_TRANSACTIONS,
    SET_FLASH_MESSAGES,
    PUSH_FLASH_MESSAGE,
    SET_ERRORS
} from '../actions'


const initialState = {
    currentUser: {},
    csrfToken: '',
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
                currentUser: action.payload.currentUser
            };

        case CSRF_TOKEN:
            return {
                ...state,
                csrfToken: action.payload.csrfToken
            };

        case SET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload.accounts
            };

        case UPDATE_ACCOUNT:
            const { accountId, accountAttrs} = action.payload;
            const acctAttrs = Object.keys(accountAttrs);
                return {
                    ...state,
                    accounts: state.accounts.map(acct => {
                        if (acct.id === Number(accountId)) {
                            for (let i=0; i < acctAttrs.length; i++) {
                                acct[acctAttrs[i]] = accountAttrs[acctAttrs[i]];
                            }
                        }
                        return acct;
                    })
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
            const tranAttrs = Object.keys(transactionAttrs);
            return {
                ...state,
                transactions: state.transactions.map(tran => {
                    if (tran.id === Number(transactionId)) {
                        for (let i=0; i < tranAttrs.length; i++) {
                            tran[tranAttrs[i]] = transactionAttrs[tranAttrs[i]];
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
