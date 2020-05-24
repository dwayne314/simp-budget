import { getErrors, isEmpty } from '../';


export const newAccountValidator = ({name='', description=''}) => {
    let errors = {};

    if (!name) {
        errors.name = getErrors('required', {fieldName: 'Name'})
    }
    if (!description) {
        errors.description = getErrors('required', {fieldName: 'Description'})
    }
    
    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? {name, description} : null,
        isValid: isEmpty(errors)
    };
};
