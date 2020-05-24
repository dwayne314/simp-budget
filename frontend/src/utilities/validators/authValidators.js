import Validator from 'validator';
import { getErrors, isEmpty } from '../';


export const registrationValidator = ({first_name='', last_name='', email='', password=''}) => {
    let errors = {};
    const passwordMinMax = {min: 7, max: 30};

    if (!first_name) {
        errors.first_name = getErrors('required', {fieldName: 'First name'})
    }
    if (!last_name) {
        errors.last_name = getErrors('required', {fieldName: 'Last name'})
    }
    if (!email) {
        errors.email = getErrors('required', {fieldName: 'Email'})
    }
    if (!password) {
        errors.password = getErrors('required', {fieldName: 'Password'})
    } else if (!Validator.isLength(password, passwordMinMax)) {
        errors.password = getErrors('minMax', {...passwordMinMax, fieldName: 'Password'})
    }
    
    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? {first_name, last_name, email, password} : null,
        isValid: isEmpty(errors)
    };
}

export const loginValidator = ({email, password}) => {
    let errors = {};
    if (!email) {
        errors.email = getErrors('required', {fieldName: 'Email'})
    }
    if (!password) {
        errors.password = getErrors('required', {fieldName: 'Password'})
    }

    return {
        errors: isEmpty(errors) ? null : errors,
        // email renamed as username to use for Basic Authentication
        result: isEmpty(errors) ? {username: email, password} : null,
        isValid: isEmpty(errors)
    };
};