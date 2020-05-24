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
};