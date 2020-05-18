import { LOGIN } from '../actions/'

const initialState = {
    currentUserId: null
};

const rootReducer = (state=initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                currentUserId: action.payload.currentUserId
            };

        default:
            return state
    };
};

export default rootReducer;
