export const getAccounts = state => state.accounts;
export const getAccountById = state => accountId => state.accounts
    .find(account => account.id === accountId);
