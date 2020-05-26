export const getTransactions = state => state.transactions;
export const getTransactionsByAccountId = state => accountId => state.transactions
    .filter(transaction => transaction.account_id === accountId);
export const getTransactionById = state => transactionId => state.transactions
    .find(transaction => transaction.id === transactionId);
