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

export const getWeeklyFrequencyFromIndex = weeklyIndex => {
    const weeklyFrequencyMapping = {
        'every 1 week': 1,
        'every 2 weeks': 2,
        'every 3 weeks': 3,
        'every 4 weeks': 4,
    };
    return weeklyFrequencyMapping[weeklyIndex];
};

export const getMonthlyFrequencyFromIndex = monthlyIndex => {
    const monthlyFrequencyMapping = {
        'every 1 month': 1,
        'every 2 months': 2,
        'every 3 months': 3,
        'every 4 months': 4,
    };
    return monthlyFrequencyMapping[monthlyIndex];
};

export const getSpecialDayFromIndex = specialDayIndex => {
    const specialDayMapping = {
        'first day of the month': 'first',
        'last day of the month': 'last',
    };
    return specialDayMapping[specialDayIndex];
};
