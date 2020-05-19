// 
// Flash Messaging Actions 
//

export const SET_FLASH_MESSAGES = 'SET_FLASH_MESSAGES';

export const setFlashMessages = (messages) => {
    return {
        type: SET_FLASH_MESSAGES,
        payload: {
            messages: messages
        }
    };
};
export const PUSH_FLASH_MESSAGE = 'PUSH_FLASH_MESSAGE';

export const pushFlashMessage = (message, messageType='error') => {
    return {
        type: PUSH_FLASH_MESSAGE,
        payload: {
            message: message,
            messageType: messageType
        }
    };
};
