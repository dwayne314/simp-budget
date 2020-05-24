export const getErrors = (type, data) => {
    if (type === 'required')  {
        return `${data.fieldName} is a required field.`
    }
    else if (type === 'minMax')  {
        return `${data.fieldName} must be between ${data.min} and ${data.max} characters.`
    }
    else return null
};