import { getErrors, isEmpty } from '../';


export const newTransactiontValidator = ({amount='', note=''}) => {
    let errors = {};
    let convertedAmount = Number(amount).toFixed(2) * 100;

    if (!amount) {
        errors.amount = getErrors('required', {fieldName: 'Amount'});
    } else if (convertedAmount === 0) {
        errors.amount = getErrors('value', {fieldName: 'Amount', value: 0});
    } else if (isNaN(convertedAmount)) {
        errors.amount = getErrors('type', {fieldName: 'Amount', typeName: 'currency'});
    }

    if (!note) {
        errors.note = getErrors('required', {fieldName: 'Note'});
    }

    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? {amount:convertedAmount, note} : null,
        isValid: isEmpty(errors)
    };
};
