import axios from 'axios';
import { formatUSD, formatDate } from './formatters'
import { registrationValidator, loginValidator, newAccountValidator } from './validators';
import { getErrors } from './errors';


const applyAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else delete axios.defaults.headers.common['Authorization'] 
}

const isEmpty = (obj) => Object.keys(obj).length === 0;

export {
    applyAuthToken,
    isEmpty,
    formatUSD,
    formatDate,
    registrationValidator,
    loginValidator,
    newAccountValidator,
    getErrors
};
