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

export const REMOVE_FLASH_MESSAGE = 'REMOVE_FLASH_MESSAGE';

export const removeFlashMessage = (messageId) => {
    return {
        type: REMOVE_FLASH_MESSAGE,
        payload: {
            messageId: messageId
        }
    };
};

// 
// Error Actions
// 

export const SET_ERRORS = 'SET_ERRORS';

export const setErrors = errors => {
    return {
        type: SET_ERRORS,
        payload: {
            errors
        }
    };
};

//
// Settings Actions
//

export const TOGGLE_SETTINGS_DRAWER = 'TOGGLE_SETTINGS_DRAWER';

export const toggleSettingsDrawer = (isSettingsDrawerOpen) => {
    return {
        type: TOGGLE_SETTINGS_DRAWER,
        payload: {
            isSettingsDrawerOpen: isSettingsDrawerOpen
        }
    };
};

export const TOGGLE_MOBILE_DISPLAY = 'TOGGLE_MOBILE_DISPLAY';

export const toggleMobileDisplay = (isMobileDisplay) => {
    return {
        type: TOGGLE_MOBILE_DISPLAY,
        payload: {
            isMobileDisplay: isMobileDisplay
        }
    };
};