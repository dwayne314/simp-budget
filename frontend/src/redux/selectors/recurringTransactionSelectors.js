export const getRecurringTransactions = state => state.recurringTransactions;
export const getRecurringTransactionsByAccountId = state => accountId => state.recurringTransactions
    .filter(transaction => transaction.account_id === accountId);
export const getRecurringTransactionById = state => transactionId => state.recurringTransactions
    .find(transaction => transaction.id === transactionId);
