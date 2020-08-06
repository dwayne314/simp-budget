import { getCurrentUser, currentUserId, getAuthTokenExpiration, getCsrfToken } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts, getAccountById } from './accountSelectors';
import { getTransactions, getTransactionsByAccountId, getTransactionById } from './transactionSelectors';
import { 
    getRecurringTransactions,
    getRecurringTransactionsByAccountId,
    getRecurringTransactionById
} from './recurringTransactionSelectors';

const currentState = state => state

export {
    getCurrentUser,
    currentUserId,
    getAuthTokenExpiration,
    getCsrfToken,
    currentState,
    flashMessages,
    getErrors,
    getAccounts,
    getAccountById,
    getTransactions,
    getTransactionsByAccountId,
    getTransactionById,
    getRecurringTransactions,
    getRecurringTransactionsByAccountId,
    getRecurringTransactionById
};
