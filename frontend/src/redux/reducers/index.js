import { LOGIN } from '../actions/'

const initialState = {
    isLoggedIn: false
};

const rootReducer = (state=initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true
            };

        default:
            return state
    };
};

export default rootReducer;
