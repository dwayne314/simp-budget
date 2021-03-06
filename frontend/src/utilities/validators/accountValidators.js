import { getErrors, isEmpty } from '../';


export const newAccountValidator = ({name='', description=''}) => {
    let errors = {};

    if (!name) {
        errors.name = getErrors('required', {fieldName: 'Name'})
    } else if (name.length > 25) {
        errors.name = getErrors('max', {fieldName: 'Name', max: 25});
    }
    
    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? {name, description} : null,
        isValid: isEmpty(errors)
    };
};
