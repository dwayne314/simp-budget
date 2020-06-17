const isEmpty = (obj) => Object.keys(obj).length === 0;

const generateCsrfHeader= (value) => {
    
    let allHeaders = { headers: { 'X-CSRFToken': value} };

    return allHeaders;
};
    
export {
    isEmpty,
    generateCsrfHeader
};
