import { currentUserId } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';
import { getAccounts } from './accountSelectors';


const currentState = state => state

export {
    currentUserId,
    currentState,
    flashMessages,
    getErrors,
    getAccounts
}