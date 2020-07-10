export const getErrors = (type, data) => {
    if (type === 'required')  {
        return `${data.fieldName} is a required field.`
    }
    else if (type === 'minMax')  {
        return `${data.fieldName} must be between ${data.min} and ${data.max} characters.`
    }
    else if (type === 'max') {
        return `${data.fieldName} must be less than ${data.max + 1} characters.`
    }
    else if (type === 'type') {
        return `${data.fieldName} must be a ${data.typeName} type.`
    }
    else if (type === 'value') {
        return `${data.fieldName} cannot be ${data.value}.`
    }
    else if (type === 'invalid-transaction') {
        return 'Transaction type must be either daily, weekly, or monthly.'
    }
    else if (type === 'scheduled-day' && data.value === 'daily') {
        return 'Daily scheduled days must be 1.'
    }
    else if (type === 'scheduled-day' && data.value === 'weekly') {
        return 'Weekly scheduled days must be between 1 and 7.'
    }
    else if (type === 'scheduled-day' && data.value === 'monthly') {
        return 'Weekly scheduled days must be between 1 and 31.'
    }
    else if (type === 'special-day') {
        return 'Special days must be "first" or "last".'
    }
    else if (type === 'frequency' && data.value === 'no-day') {
        return 'A scheduled day or a special day must be specified.'
    }
    else if (type === 'frequency' && data.value === 'too-many-days') {
        return 'A recurring transaction cannot have both a special day and a scheduled day.'
    }
    else if (type === 'frequency' && data.value === 'daily') {
        return 'A daily transaction must have a frequency of 1.'
    }
    else if (type === 'frequency' && data.value === 'weekly') {
        return 'A daily transaction must have a frequency between 1 and 4.'
    }
    else if (type === 'frequency' && data.value === 'monthly') {
        return 'A daily transaction must have a frequency between 1 and 4.'
    }


    else return null
};