import { currentUserId } from './authSelectors';
import { flashMessages, getErrors} from './notificationSelectors';


const currentState = state => state

export {
    currentUserId,
    currentState,
    flashMessages,
    getErrors
}