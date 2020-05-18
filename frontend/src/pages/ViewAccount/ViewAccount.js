import React from 'react';
import './ViewAccount.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const ViewAccount = () => {
    const accountId = 1
    const transactions = [{amount: '$40.70', note: 'For Foodsdssddffdffdfdffsdafdafdffaddds', date: '3/17'},
                          {amount: '$1,000,000.09', note: 'For Dress', date: '3/18'},
                          {amount: '$200.42', note: 'For Food', date: '3/19'},
                          {amount: '$1,000,000.09', note: 'For Dress', date: '3/18'},
                          {amount: '$200.42', note: 'For Food', date: '3/19'},
                          {amount: '$1,000,000.09', note: 'For Dress', date: '3/18'},
                          {amount: '$200.42', note: 'For Food', date: '3/19'},
                          {amount: '$1,000,000.09', note: 'For Dress', date: '3/18'},
                          {amount: '$200.42', note: 'For Food', date: '3/19'}]

    const allTransactions = transactions.map(tran => (
         <div className="view-account-transaction-container">
            <div className="view-account-transaction-header">
                <div className="view-account-transaction-date">{tran.date}</div>
                <div className="view-account-transaction-amount">{tran.amount}</div>
            </div>
            <div className="view-account-transaction-note">
                {tran.note}
            </div>
        </div> 
        ))

    return (
        <div className="view-account-container">
            <div className="view-account-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="view-account-header-container">
                <div className="view-account-header-text">Accounts</div>
                <div className="account-balance">$30,000.78</div>
            </div>
            <div className="modify-account-container">
                <div className="modify-account-button-container">
                    <Button isPrimary={false} cta={"Edit Account"} linkPath={`/accounts/${accountId}/edit`}/>
                </div>
                <div className="modify-account-button-container">
                    <Button isDelete={true} cta={"Delete Account"} linkPath={`/accounts/${accountId}/delete`}/>
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
            {allTransactions}  
            <div className="modify-account-transaction-buttons">
                    <Button isPrimary={true} cta={"Select Transactions"}/>
                    <Button isPrimary={false} cta={"New Transaction"} linkPath={`/accounts/${accountId}/transactions/create`}/>

            </div>    
        </div>
    );
};

export default ViewAccount;
