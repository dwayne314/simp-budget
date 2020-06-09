import { getCurrentUser, currentUserId, getAuthTokenExpiration } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts, getAccountById } from './accountSelectors';
import { getTransactions, getTransactionsByAccountId, getTransactionById } from './transactionSelectors';


const currentState = state => state

export {
    getCurrentUser,
    currentUserId,
    getAuthTokenExpiration,
    currentState,
    flashMessages,
    getErrors,
    getAccounts,
    getAccountById,
    getTransactions,
    getTransactionsByAccountId,
    getTransactionById
};
