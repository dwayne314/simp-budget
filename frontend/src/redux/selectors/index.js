import { currentUserId } from './authSelectors';
import { flashMessages } from './notificationSelectors';


const currentState = state => state

export {
    currentUserId,
    currentState,
    flashMessages
}