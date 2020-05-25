import React, { useState, useEffect, Fragment } from 'react';
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
    const [searchText, setSearchText] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [selectTransactionToggle, setSelectTransactionToggle] = useState(false);
    const filteredTransactions = transactions
        .filter(tran => tran.note.indexOf(searchText) !== -1);

    const updateSearchText = (evt) => setSearchText(evt.target.value);
    const submiSearchtForm = (evt) => evt.preventDefault();
    const updateSelectTransactionToggle = () => {
        setSelectedTransactions([]);        
        setSelectTransactionToggle(selectTransactionToggle ? false : true);
    };

    const toggleSelection = transactionId => {
        const transactionIndex = selectedTransactions.indexOf(transactionId);
        if (transactionIndex === -1) {
            setSelectedTransactions([...selectedTransactions, transactionId]);
        }
        else {
            setSelectedTransactions(selectedTransactions.filter(tranId => tranId !== transactionId));
        }
    };

    const showAllTransactions = filteredTransactions.map(tran => {
        let transactionClasses = `view-account-transaction-container${(selectedTransactions.indexOf(tran.id) !== -1) ? ' selected-transaction' : ''}`
        transactionClasses = transactionClasses + `${selectTransactionToggle ? ' selectable-transaction' : ''}` 
        return (
            <div onClick={selectTransactionToggle ? () => toggleSelection(tran.id) : null} 
                  className={transactionClasses}>
                <div className="view-account-transaction-header">
                    <div className="view-account-transaction-date">{formatDate(tran.created_at)}</div>
                    <div className="view-account-transaction-amount">{formatUSD(tran.amount)}</div>
                </div>
                <div className="view-account-transaction-note">
                    {tran.note}
                </div>
            </div>
        )
    });

    const showActionButtons = () => {
        let actionButtons;
        if (!selectTransactionToggle) {
            actionButtons = (
                <Fragment>
                    <div className="modify-account-button-container">
                        <Button isPrimary={false} cta={"Edit Account"} linkPath={`/accounts/${currentAccount.id}/edit`}/>
                    </div>
                    <div className="modify-account-button-container">
                        <Button isDelete={true} cta={"Delete Account"} linkPath={`/accounts/${currentAccount.id}/delete`}/>
                    </div>
                </Fragment>
            );
        } else if (selectTransactionToggle && !selectedTransactions.length) {
            actionButtons = (
                <Fragment>
                    <div className="modify-account-button-container">
                        <Button isDulledPrimary={true} cta={"Edit"}/>
                    </div>
                    <div className="modify-account-button-container">
                        <Button isDulledDelete={true} cta={"Delete"}/>
                    </div>
                </Fragment>
            );
        } else if (selectTransactionToggle && selectedTransactions.length < 2) {
            const selectedTransactionId = selectedTransactions[0];

            actionButtons = (
                <Fragment>
                    <div className="modify-account-button-container">
                        <Button isPrimary={false} cta={"Edit"} linkPath={`/accounts/${currentAccount.id}/transactions/${selectedTransactionId}/edit`}/>
                    </div>
                    <div className="modify-account-button-container">
                        <Button isDelete={true}
                                cta={"Delete"}
                                data={{transactions: selectedTransactions, accountId}}
                                linkPath={`/accounts/${currentAccount.id}/transactions/delete`}/>
                    </div>
                </Fragment>
            );
        } else {
            actionButtons = (
                <Fragment>
                    <div className="modify-account-button-container">
                        <Button isDelete={true}
                                cta={"Delete"}
                                data={{transactions: selectedTransactions, accountId}}                                
                                linkPath={`/accounts/${currentAccount.id}/transactions/delete`}/>
                    </div>
                </Fragment>
            );
        } 
        return actionButtons;
    };

    useEffect(() => {
        console.log(selectedTransactions)
    })

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
                {showActionButtons()}
            </div>
            <div className="view-account-search-form-container">
                <div>
                    <div className="search-form">
                        <form onSubmit={submiSearchtForm}>
                            <input onChange={updateSearchText} type="text" placeholder="Search Transactions" value={searchText}></input>
                        </form>
                    </div>
                </div>
            </div>
            {showAllTransactions}  
            <div className="modify-account-transaction-floating-buttons">
            {!selectTransactionToggle ? 
                <Fragment>
                    <Button isPrimary={false} cta={"New Transaction"} linkPath={`/accounts/${currentAccount.id}/transactions/create`}/>
                    <Button onClick={updateSelectTransactionToggle} isPrimary={true} cta={"Select Transactions"}/>
                </Fragment>
                :
                <Button onClick={updateSelectTransactionToggle} isPrimary={true} cta={"Stop Selection"}/>
            }
            </div>    
        </div>
    );
};

export default ViewAccount;
