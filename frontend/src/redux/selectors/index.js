import { getCurrentUser, currentUserId, getAuthToken, getAuthTokenExpiration } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts, getAccountById } from './accountSelectors';
import { getTransactions, getTransactionsByAccountId, getTransactionById } from './transactionSelectors';


const currentState = state => state

export {
    getCurrentUser,
    currentUserId,
    getAuthToken,
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
