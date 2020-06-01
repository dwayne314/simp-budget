import { currentUserId } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts, getAccountById } from './accountSelectors';
import { getTransactions, getTransactionsByAccountId, getTransactionById } from './transactionSelectors';


const currentState = state => state

export {
    currentUserId,
    currentState,
    flashMessages,
    getErrors,
    getAccounts,
    getAccountById,
    getTransactions,
    getTransactionsByAccountId,
    getTransactionById
};
