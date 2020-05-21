import React from 'react';
import { useSelector } from 'react-redux';
import './ViewAccount.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import { getAccountById, getTransactionsByAccountId } from '../../redux/selectors';
import { formatUSD, formatDate } from '../../utilities';


const ViewAccount = (props) => {
    const { id:accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId)));
    const transactions = useSelector(state => getTransactionsByAccountId(state)(Number(accountId)));
    const accountBalance = transactions.reduce((acc, tran) => acc + tran.amount, 0);

    const allTransactions = transactions.map(tran => (
         <div className="view-account-transaction-container">
            <div className="view-account-transaction-header">
                <div className="view-account-transaction-date">{formatDate(tran.created_at)}</div>
                <div className="view-account-transaction-amount">{formatUSD(tran.amount)}</div>
            </div>
            <div className="view-account-transaction-note">
                {tran.note}
            </div>
        </div> 
    ));

    return (
        <div className="view-account-container">
            <div className="view-account-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="view-account-header-container">
                <div className="view-account-header-text">{currentAccount.name}</div>
                <div className="account-balance">{formatUSD(accountBalance)}</div>
            </div>
            <div className="account-description-container">
                {currentAccount.description}
            </div>
            <div className="modify-account-container">
                <div className="modify-account-button-container">
                    <Button isPrimary={false} cta={"Edit Account"} linkPath={`/accounts/${currentAccount.accountId}/edit`}/>
                </div>
                <div className="modify-account-button-container">
                    <Button isDelete={true} cta={"Delete Account"} linkPath={`/accounts/${currentAccount.accountId}/delete`}/>
                </div>
            </div>
            <div className="view-account-search-form-container">
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
                    <Button isPrimary={false} cta={"New Transaction"} linkPath={`/accounts/${currentAccount.accountId}/transactions/create`}/>

            </div>    
        </div>
    );
};

export default ViewAccount;
