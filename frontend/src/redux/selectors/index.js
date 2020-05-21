import { currentUserId } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts } from './accountSelectors';
import { getTransactions } from './transactionSelectors';


const currentState = state => state

export {
    currentUserId,
    currentState,
    flashMessages,
    getErrors,
    getAccounts,
    getTransactions
}