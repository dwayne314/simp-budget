import { getErrors, isEmpty } from '../';
import { formatDate } from '../../utilities';


export const newTransactiontValidator = ({amount='', note='', date=''}) => {
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

    if (!date) {
        errors.date = getErrors('required', {fieldName: 'Date'})
    }

    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? {amount:convertedAmount, note, date: formatDate(date, 'yyyy-mm-dd')} : null,
        isValid: isEmpty(errors)
    };
};
