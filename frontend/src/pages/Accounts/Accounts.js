import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Accounts.css';
import Logo from '../../components/Logo/Logo';
import newIcon from '../../static/icons/new-icon.svg';
import Button from '../../components/Button/Button';
import { getAccounts, getTransactions } from '../../redux/selectors';
import { formatDate, formatUSD, getLocalDate } from '../../utilities';


const Accounts = () => {
    const accounts = useSelector(getAccounts); 
    const transactions = useSelector(getTransactions);
    const [allAccounts, setAllAccounts] = useState(accounts);
    const [seachText, setSearchText] = useState('');

    const updateSearchText = (evt) => setSearchText(evt.target.value);
    const getAccountTransactions = (accountId) => transactions
        .filter(transaction => transaction.account_id === accountId);
    const submiSearchtForm = (evt) => evt.preventDefault();

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
                                    </tbody>))
                                }
                            </table>
                        </Fragment>
                </div>
                <div className="account-transaction-button-container">
                    <Button isPrimary={false} cta={"View Account"} linkPath={`/accounts/${account.id}/view`}/>
                </div>
            </div>
    });

    useEffect(() => {
        setAllAccounts(accounts.filter(account => account.name.toLowerCase().indexOf(seachText.toLowerCase()) !== -1 ));
    }, [accounts, seachText]);

    return (
        <div className="accounts-container">
            <div className="accounts-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="accounts-header-container">
                <div className="accounts-header-text">Accounts</div>
                <div className="new-account-icon">
                    <Link to="/accounts/create">
                        <img src={newIcon} alt="plus-sign"></img>
                    </Link>
                </div>
            </div>
            <div className="search-form-container">
                <div>
                    <div className="search-form">
                        <form onSubmit={submiSearchtForm}>
                            <input onChange={updateSearchText} type="text" placeholder="Search" value={seachText}></input>
                        </form>
                    </div>
                </div>
            </div>
            <div className="all-accounts-container">
                {showAllAccounts}
            </div>
        </div>
    );
};

export default Accounts;
