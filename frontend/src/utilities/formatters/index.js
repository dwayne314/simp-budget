// Converts an integer in cents to US currency
export const formatUSD = (cents) => {
    const dollars = cents / 100
    const usd = new Intl.NumberFormat(
        'en-US', {style: 'currency', currency: 'USD'}
    ).format(dollars);
    
    return usd;
};

// Converts a UTC timestamp into the specified date format
export const formatDate = (date, style='md') => {
    const d = new Date(date);

    if (style === 'md') {
        const month = d.getMonth() + 1;
        const day = d.getDate();

        return `${month}/${day}`;
    }
    else if (style === 'yyyy-mm-dd') {
        const year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`  
    }
};

export const formatDateUTC = (date, style='md') => {
    const d = new Date(date);

    if (style === 'md') {
        const month = d.getUTCMonth() + 1;
        const day = d.getUTCDate();

        return `${month}/${day}`;
    }
    else if (style === 'yyyy-mm-dd') {
        const year = d.getUTCFullYear();
        let month = d.getUTCMonth() + 1;
        let day = d.getUTCDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`
    }
};

// Converts a UTC Date to the client's timezone
export const getLocalDate = date => {
    const currentDateTime = new Date(date);
    const minuteOffset = currentDateTime.getTimezoneOffset();
    const convertedDateTime = new Date(currentDateTime.getTime() + minuteOffset*60000);
    return convertedDateTime;
};

export const getWeekDayFromIndex = dayIndex => {
    const dayOfWeekMapping = {
        'Sunday': 1,
        'Monday': 2,
        'Tuesday': 3,
        'Wednesday': 4,
        'Thursday': 5,
        'Friday': 6,
        'Saturday': 7,
        1:'Sunday',
        2:'Monday',
        3:'Tuesday',
        4:'Wednesday',
        5:'Thursday',
        6:'Friday',
        7:'Saturday',        
    };

    return dayOfWeekMapping[dayIndex];
};

export const getMonthDayFromIndex = dayIndex => {
    const dayOfWeekMapping = {
        '1st': 1,
        '2nd': 2,
        '3rd': 3,
        '4th': 4,
        '5th': 5,
        '6th': 6,
        '7th': 7,
        '8th': 8, 
        '9th': 9, 
        '10th': 10, 
        '11th': 11, 
        '12th': 12, 
        '13th': 13, 
        '14th': 14, 
        '15th': 15, 
        '16th': 16, 
        '17th': 17, 
        '18th': 18, 
        '19th': 19, 
        '20th': 20, 
        '21st': 21, 
        '22nd': 22, 
        '23rd': 23, 
        '24th': 24, 
        '25th': 25, 
        '26th': 26, 
        '27th': 27, 
        '28th': 28, 
        '29th': 29, 
        '30th': 30, 
        '31st': 31, 
    };

    return dayOfWeekMapping[dayIndex];
};

export const mapOrdinalIndicators = (indicator) => {
    const ordinalMapping = {
         1: '1st',
         2: '2nd',
         3: '3rd',
         4: '4th',
         5: '5th',
         6: '6th',
         7: '7th',
         8: '8th',
         9: '9th',
         10: '10th',
         11: '11th',
         12: '12th',
         13: '13th',
         14: '14th',
         15: '15th',
         16: '16th',
         17: '17th',
         18: '18th',
         19: '19th',
         20: '20th',
         21: '21st',
         22: '22nd',
         23: '23rd',
         24: '24th',
         25: '25th',
         26: '26th',
         27: '27th',
         28: '28th',
         29: '29th',
         30: '30th',
         31: '31st',
        '1st': 1,
        '2nd': 2,
        '3rd': 3,
        '4th': 4,
        '5th': 5,
        '6th': 6,
        '7th': 7,
        '8th': 8, 
        '9th': 9, 
        '10th': 10, 
        '11th': 11, 
        '12th': 12, 
        '13th': 13, 
        '14th': 14, 
        '15th': 15, 
        '16th': 16, 
        '17th': 17, 
        '18th': 18, 
        '19th': 19, 
        '20th': 20, 
        '21st': 21, 
        '22nd': 22, 
        '23rd': 23, 
        '24th': 24, 
        '25th': 25, 
        '26th': 26, 
        '27th': 27, 
        '28th': 28, 
        '29th': 29, 
        '30th': 30, 
        '31st': 31, 
    };

    return ordinalMapping[indicator] 
};

export const getWeeklyFrequencyFromIndex = weeklyIndex => {
    const weeklyFrequencyMapping = {
        'every 1 week': 1,
        'every 2 weeks': 2,
        'every 3 weeks': 3,
        'every 4 weeks': 4,
        1: 'every 1 week',
        2: 'every 2 weeks',
        3: 'every 3 weeks',
        4: 'every 4 weeks',
    };
    return weeklyFrequencyMapping[weeklyIndex];
};

export const getMonthlyFrequencyFromIndex = monthlyIndex => {
    const monthlyFrequencyMapping = {
        'every 1 month': 1,
        'every 2 months': 2,
        'every 3 months': 3,
        'every 4 months': 4,
        1: 'every 1 month',
        2: 'every 2 months',
        3: 'every 3 months',
        4: 'every 4 months',
    };
    return monthlyFrequencyMapping[monthlyIndex];
};

export const getSpecialDayFromIndex = specialDayIndex => {
    const specialDayMapping = {
        'first day of the month': 'first',
        'last day of the month': 'last',
        'first': 'first day of the month',
        'last': 'last day of the month',
    };
    return specialDayMapping[specialDayIndex];
};

export const getRecurringTransactionText = (recurringTransaction) => {

    const constainsFrequencyGap = recurringTransaction.frequency !== 1;

    if (recurringTransaction.transaction_type === 'daily') {
        return 'Daily';
    }
    else {
        if (recurringTransaction.transaction_type === 'weekly') {
            const frequencyText = constainsFrequencyGap ? `Every ${recurringTransaction.frequency} weeks ` : 'weekly ';
            return frequencyText + `on ${getWeekDayFromIndex(recurringTransaction.scheduled_day)}`;
        }
        else {
            const frequencyText = constainsFrequencyGap ? `Every ${recurringTransaction.frequency} months ` : 'monthly ';

            if (recurringTransaction.special_day) {
                return frequencyText + `on the ${recurringTransaction.special_day} day of the the month`;
            }
            return frequencyText + `on the ${mapOrdinalIndicators(recurringTransaction.scheduled_day)}`;
        }
    }
};

export const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const decoded = Buffer.from(base64Url, 'base64').toString();
    return JSON.parse(decoded);
};