import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Paginator from '../../components/Paginator/Paginator';
import Icon from '../../components/Icon/Icon';
import SearchForm from '../../components/SearchForm/SearchForm';
import { getAccounts, getTransactions } from '../../redux/selectors';
import { formatUSD } from '../../utilities';

import addIcon from '../../static/icons/plus-button.svg';
import searchIcon from '../../static/icons/magnifying-glass.svg';

import './Accounts.css';


const Accounts = (props) => {
    const accountsPerPage = 10;
    const accounts = useSelector(getAccounts);
    const transactions = useSelector(getTransactions);

    const [allAccounts, setAllAccounts] = useState(accounts);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const pages = Math.ceil(allAccounts.length / accountsPerPage);

    const decrementPage = () => setPage(page > 1 ? page - 1 : page);
    const incrementPage = () => setPage(page < pages ? page + 1 : page);
    const updateSearchText = (evt) => {
        setPage(1);
        return setSearchText(evt.target.value);
    };
    const getAccountTransactions = (accountId) => transactions
        .filter(transaction => transaction.account_id === accountId);
    const viewAccount = account => props.history.push(`/accounts/${account.id}/view`);
    const toggleSearch = () => setIsSearching(isSearching ? false : true)


    const accountBalanceById = accounts.reduce((acc, acct) => {
        const accountBalance = getAccountTransactions(acct.id).reduce((bal, tran) => {
            return bal + tran.amount
        }, 0)

        acc[acct.id] = formatUSD(accountBalance)
        return acc
    }, {})


    const showAllAccounts = allAccounts.map((account, index) => {
        return <div key={account.id} className="view-accounts-container" onClick={() => viewAccount(account)}>
                    <div className="view-accounts-account-name">{account.name}</div>
                    <div className="view-accounts-account-balance">{accountBalanceById[account.id]}</div>
                </div>

    }).slice((page-1) * accountsPerPage, accountsPerPage * page);

    useEffect(() => {
        setAllAccounts(accounts.filter(account => account.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ));
    }, [accounts, searchText]);

    return (
        <Fragment>
            <div className="accounts-container">
                <div className="accounts-header-container">
                    <div className="accounts-header-text">Accounts</div>
                </div>
                <div className="view-account-actions-container">
                    <Icon type={addIcon} alt="plus-icon" linkPath={`/accounts/create`}/>
                    <Icon
                        type={searchIcon} 
                        alt="magnifying-glass"
                        onClick={toggleSearch}
                    />
                </div>

                {
                    isSearching ? 
                        <SearchForm onChange={updateSearchText} searchText={searchText} placeholder="Search Accounts"/>
                        :
                        ""
                }
                <Paginator pageCount={pages} currentPage={page} decrementPage={decrementPage} incrementPage={incrementPage} />
                <div className="all-accounts-container">
                    {showAllAccounts}
                </div>
            </div>
        </Fragment>
    );
};

export default Accounts;
