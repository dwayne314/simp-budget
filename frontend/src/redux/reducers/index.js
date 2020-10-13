import { 
    LOGIN,
    CSRF_TOKEN,
    SET_EMAIL_VERIFICATION_DATE,
    SET_ACCOUNTS,
    UPDATE_ACCOUNT,
    ADD_ACCOUNT,
    REMOVE_ACCOUNT,
    SET_TRANSACTIONS,
    ADD_TRANSACTIONS,
    UPDATE_TRANSACTION,
    REMOVE_TRANSACTIONS,
    SET_FLASH_MESSAGES,
    PUSH_FLASH_MESSAGE,
    SET_ERRORS,
    TOGGLE_SETTINGS_DRAWER,
    TOGGLE_MOBILE_DISPLAY,
    ADD_RECURRING_TRANSACTIONS,
    SET_RECURRING_TRANSACTIONS,
    UPDATE_RECURRING_TRANSACTION,
    REMOVE_RECURRING_TRANSACTIONS
} from '../actions'


const initialState = {
    currentUser: {},
    csrfToken: '',
    accounts: [],
    transactions: [],
    recurringTransactions: [],
    flashMessages: [],
    errors: {},
    isSettingsDrawerOpen: false,
    isMobileDisplay: null
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

        case SET_EMAIL_VERIFICATION_DATE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    email_verified_at: action.payload.date
                }
            };

        case SET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload.accounts
            };

        case ADD_ACCOUNT:
            return {
                ...state,
                accounts: [...state.accounts, action.payload.account]
            }

        case REMOVE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(account => account.id !== Number(action.payload.accountId))
            }


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

        case SET_RECURRING_TRANSACTIONS:
            return {
                ...state,
                recurringTransactions: action.payload.recurringTransactions
            }

        case ADD_RECURRING_TRANSACTIONS:
            return {
                ...state,
                recurringTransactions: [...state.recurringTransactions, ...action.payload.recurringTransaction]
            }

        case UPDATE_RECURRING_TRANSACTION:
            const { recurringTransactionId, recurringTransactionAttrs} = action.payload;
                const recurringTranAttrs = Object.keys(recurringTransactionAttrs);
                return {
                    ...state,
                    recurringTransactions: state.recurringTransactions.map(tran => {
                        if (tran.id === Number(recurringTransactionId)) {
                            for (let i=0; i < recurringTranAttrs.length; i++) {
                                tran[recurringTranAttrs[i]] = recurringTransactionAttrs[recurringTranAttrs[i]];
                            }
                        }
                        return tran;
                    })
                };

        case REMOVE_RECURRING_TRANSACTIONS:
            const { recurringTransactionIds } = action.payload
            return {
                ...state,
                recurringTransactions: state.recurringTransactions.filter(tran => recurringTransactionIds.indexOf(tran.id) === -1)
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
            };

        case TOGGLE_SETTINGS_DRAWER:
            const { isSettingsDrawerOpen } = action.payload;

            return {
                ...state,
                isSettingsDrawerOpen: isSettingsDrawerOpen
            };

        case TOGGLE_MOBILE_DISPLAY:
            const { isMobileDisplay } = action.payload;
            return {
                ...state,
                isMobileDisplay: isMobileDisplay
            };

        default:
            return state
    };
};

export default rootReducer;
