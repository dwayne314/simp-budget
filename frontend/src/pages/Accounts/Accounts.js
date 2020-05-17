import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Accounts.css';
import Logo from '../../components/Logo/Logo';
import newIcon from '../../static/icons/new-icon.svg';
import Button from '../../components/Button/Button';


const Accounts = () => {


    const accounts = [{id: 1, name: 'PNC Bank', balance: '$300,000.89'},
                      {id: 2, name: 'PNC Bank', balance: '$300,000.89', selected: true},
                      {id: 3, name: 'PNC Bank', balance: '$300,000.89', selected: true}]

    const transactions = [{amount: '$40.70', note: 'For Foodsdssddffdffdfdffsdafdafdffaddds', date: '3/17'},
                          {amount: '$1,000,000.09', note: 'For Dress', date: '3/18'},
                          {amount: '$200.42', note: 'For Food', date: '3/19'}]

    const allAccounts = accounts.map(account => (
        !account.selected ? 
        <div className="account-container">
            <div className="account-header-container">
                <div className="account-name">{account.name}</div>
                <div className="account-balance">{account.balance}</div>
                <div className="account-triangle"></div>
            </div>

        </div> 
        :
        <div className={"account-container account-container-clicked"}>
            <div className="account-header-container">
                <div className="account-name">{account.name}</div>
                <div className="account-balance">{account.balance}</div>
                <div className="account-triangle-clicked"></div>
            </div>
            <div className="account-tractions-exerpt-container">
                {/* If availableaccount transactions vs no */}
                {account.id !== 2 ? ''
                    :
                    <Fragment>

                        <thead className="account-tractions-exerpt-header">
                            <tr>
                                <td className="account-transaction-exerpt-amount account-transaction-exerpt-header-item">Amount</td>
                                <td className="account-transaction-exerpt-note account-transaction-exerpt-header-item">Note</td>
                                <td className="account-transaction-exerpt-date account-transaction-exerpt-header-item">Date</td>                                               
                            </tr>
                        </thead>
                        {transactions.map(transaction => (
                            <tbody className="account-tractions-exerpt-header">
                                <tr>
                                    <td className="account-transaction-exerpt-amount">{transaction.amount}</td>
                                    <td className="account-transaction-exerpt-note">{transaction.note}</td>
                                    <td className="account-transaction-exerpt-date">{transaction.date}</td>                                               
                                </tr>
                            </tbody>))
                        }
                    </Fragment>
                }
            </div>
            <div className="account-transaction-button-container">
                <Button isPrimary={false} cta={"View Account"} linkPath={`/accounts/${account.id}/view`}/>
            </div>
        </div> 
    ));
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
                        <form>
                            <input type="text" placeholder="Search"></input>
                        </form>
                    </div>
                </div>
            </div>
            <div className="all-accounts-container">
                {allAccounts}
            </div>
        </div>
    );
};

export default Accounts;
