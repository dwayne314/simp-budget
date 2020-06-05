import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import newIcon from '../../static/icons/new-icon.svg';
import Paginator from '../../components/Paginator/Paginator';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import SearchForm from '../../components/SearchForm/SearchForm';
import { getAccounts, getTransactions } from '../../redux/selectors';
import { formatDate, formatUSD, getLocalDate } from '../../utilities';
import './Accounts.css';


const Accounts = () => {
    const accountsPerPage = 10;
    const transactionsPerPage = 5;
    const accounts = useSelector(getAccounts); 
    const transactions = useSelector(getTransactions);
    const [allAccounts, setAllAccounts] = useState(accounts);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const pages = Math.ceil(allAccounts.length / accountsPerPage);

    const decrementPage = () => setPage(page > 1 ? page - 1 : page);
    const incrementPage = () => setPage(page < pages ? page + 1 : page);
    const updateSearchText = (evt) => {
        setPage(1);
        return setSearchText(evt.target.value);
    };
    const getAccountTransactions = (accountId) => transactions
        .filter(transaction => transaction.account_id === accountId);
    const toggleActiveAccount = (accountId) => {
        const updatedAccounts = allAccounts.map(account => {
            if (account.id === accountId) {
                account.selected = !account.selected ? true : false
            }
            else {
                account.selected = false
            }
            return account;
        });
        setAllAccounts(updatedAccounts);
    };

    const showAllAccounts = allAccounts.map((account, index) => {
        const accountTransactions = getAccountTransactions(account.id);

        return !account.selected ?
            <div key={`account ${account.id}`} className="account-container">
                <div className="account-header-container">
                    <div className="account-name">{account.name}</div>
                    <div className="account-triangle" onClick={() => toggleActiveAccount(account.id)}></div>
                </div>

            </div>
            :
            <div key={account.id} className={"account-container account-container-clicked"}>
                <div className="account-header-container">
                    <div className="account-name">{account.name}</div>
                     <div className="account-triangle-clicked" onClick={() => toggleActiveAccount(account.id)}></div>
                </div>
                <div className="account-tractions-exerpt-container">
                    {/* If availableaccount transactions vs no */}
                        <Fragment>
                            <table>
                                <thead className="account-tractions-exerpt-header">
                                    <tr>
                                        <td className="account-transaction-exerpt-amount account-transaction-exerpt-header-item">Amount</td>
                                        <td className="account-transaction-exerpt-note account-transaction-exerpt-header-item">Note</td>
                                        <td className="account-transaction-exerpt-date account-transaction-exerpt-header-item">Date</td>                                               
                                    </tr>
                                </thead>
                                {accountTransactions.map(transaction => (
                                    <tbody key={transaction.id} className="account-tractions-exerpt-header">
                                        <tr>
                                            <td className="account-transaction-exerpt-amount">{formatUSD(transaction.amount)}</td>
                                            <td className="account-transaction-exerpt-note">{transaction.note}</td>
                                            <td className="account-transaction-exerpt-date">{formatDate(getLocalDate(transaction.date))}</td>                                               
                                        </tr>
                                    </tbody>)).slice(0, transactionsPerPage)
                                }
                            </table>
                        </Fragment>
                </div>
                <div className="account-transaction-button-container">
                    <Button isPrimary={false} cta={"View Account"} linkPath={`/accounts/${account.id}/view`}/>
                </div>
            </div>
    }).slice((page-1) * accountsPerPage, accountsPerPage * page);

    useEffect(() => {
        setAllAccounts(accounts.filter(account => account.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ));
    }, [accounts, searchText]);

    return (
        <Fragment>
            <Header isPrimary={true} />

            <div className="accounts-container">
                <div className="accounts-header-container">
                    <div className="accounts-header-text">Accounts</div>
                    <div className="new-account-icon">
                        <Link to="/accounts/create">
                            <img src={newIcon} alt="plus-sign"></img>
                        </Link>
                    </div>
                </div>
                <SearchForm onChange={updateSearchText} searchText={searchText} placeholder="Search Accounts"/>
                <Paginator pageCount={pages} currentPage={page} decrementPage={decrementPage} incrementPage={incrementPage} />
                <div className="all-accounts-container">
                    {showAllAccounts}
                </div>
            </div>
        </Fragment>
    );
};

export default Accounts;
