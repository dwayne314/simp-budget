import axios from 'axios';


const applyAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log(axios.defaults.headers)
    }
    else delete axios.defaults.headers.common['Authorization'] 
}

export {
    applyAuthToken
};
