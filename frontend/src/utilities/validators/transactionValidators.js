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


export const newRecurringTransactionValidator = ({amount='', note='', transactionType='', frequency='', scheduledDay='', specialDay=''}) => {
    let errors = {};
    let convertedAmount = Number(amount).toFixed(2) * 100;
    let convertedFreqeuncy = Number(frequency);
    let convertedScheduledDay = Number(scheduledDay)

    let validTransactionTypes = ['daily', 'weekly', 'monthly'];
    let validSpecialDays = ['last', 'first'];
    let validWeeklyScheduledDays = [1,2,3,4,5,6,7];
    let validWeeklyAndMonthlyFrequencies = [1,2,3,4];
    const validMonthlyScheduledDays = Array.from(Array(31), (_, i) => i + 1);

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

    if (!transactionType) {
        errors.transaction_type = getErrors('required', {fieldName: 'Transaction Type'});
    } else if (validTransactionTypes.indexOf(transactionType) === -1) {
        errors.transaction_type = getErrors('invalid-transaction')
    }


    if (scheduledDay) {
        if (transactionType === 'daily' && convertedScheduledDay !== 1) {
            errors.scheduled_day = getErrors('scheduled-day', {value: 'daily'})
        } else if (transactionType === 'weekly' && validWeeklyScheduledDays.indexOf(scheduledDay) === -1) {
            errors.scheduled_day = getErrors('scheduled-day', {value: 'weekly'})
        } else if (transactionType === 'monthly' && validMonthlyScheduledDays.indexOf(scheduledDay) === -1) {
            errors.scheduled_day = getErrors('scheduled-day', {value: 'monthly'})
        }
    }

    if (specialDay) {
        if (validSpecialDays.indexOf(specialDay) === -1) {
            errors.special_day = getErrors('special-day')
        }
    }

    if (!frequency) {
        errors.frequency = getErrors('required', {fieldName: 'Frequency'});        
    } else if (specialDay === '' && scheduledDay === '') {
        errors.frequency = getErrors('frequency', {value: 'no-day'})
    } else if (specialDay !== '' && scheduledDay !== '') {
        errors.frequency = getErrors('frequency', {value: 'too-many-days'})
    } else if (transactionType === 'daily' && convertedFreqeuncy !== 1) {
        errors.frequency = getErrors('frequency', {value: 'daily'})
    } else if (transactionType === 'weekly' && validWeeklyAndMonthlyFrequencies.indexOf(frequency) === -1) {
        errors.frequency = getErrors('frequency', {value: 'weekly'})
    } else if (transactionType === 'monthly' && validWeeklyAndMonthlyFrequencies.indexOf(frequency) === -1) {
        errors.frequency = getErrors('frequency', {value: 'monthly'})
    }



    let result;

    if (scheduledDay) {
        result = {amount:convertedAmount, note, transaction_type: transactionType, frequency:convertedFreqeuncy, scheduled_day: convertedScheduledDay}
    } else {
        result = {amount:convertedAmount, note, transaction_type: transactionType, frequency:convertedFreqeuncy, special_day: specialDay}
    }




    return {
        errors: isEmpty(errors) ? null : errors,
        result: isEmpty(errors) ? result : null,
        isValid: isEmpty(errors)
    };
};




