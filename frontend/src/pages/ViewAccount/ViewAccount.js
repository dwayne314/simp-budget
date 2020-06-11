import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Paginator from '../../components/Paginator/Paginator';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import SearchForm from '../../components/SearchForm/SearchForm';
import { getAccountById, getTransactionsByAccountId } from '../../redux/selectors';
import { formatUSD, formatDate, getLocalDate } from '../../utilities';
import './ViewAccount.css';


const ViewAccount = (props) => {
    const transactionsPerPage = 5;
    const { id:accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId)));
    const transactions = useSelector(state => getTransactionsByAccountId(state)(Number(accountId)));
    const accountBalance = transactions.reduce((acc, tran) => acc + tran.amount, 0);
    const [searchText, setSearchText] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [selectTransactionToggle, setSelectTransactionToggle] = useState(false);
    const [page, setPage] = useState(1);

    const filteredTransactions = transactions
        .filter(tran => tran.note.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    const pages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const decrementPage = () => setPage(page > 1 ? page - 1 : page);
    const incrementPage = () => setPage(page < pages ? page + 1 : page);
    const updateSearchText = (evt) => setSearchText(evt.target.value);
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
            <div key={tran.id} onClick={selectTransactionToggle ? () => toggleSelection(tran.id) : null} 
                  className={transactionClasses}>
                <div className="view-account-transaction-header">
                    <div className="view-account-transaction-date">{formatDate(getLocalDate(tran.date))}</div>
                    <div className="view-account-transaction-amount">{formatUSD(tran.amount)}</div>
                </div>
                <div className="view-account-transaction-note">
                    {tran.note}
                </div>
            </div>
        )
    }).slice((page-1) * transactionsPerPage, transactionsPerPage * page);

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

    return (
        <div className="view-container-container">
            <Header isPrimary={true}/>
            <div className="view-account-body-container">
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
                <SearchForm onChange={updateSearchText} searchText={searchText} placeholder="Search Transactions"/>
                <Paginator pageCount={pages} currentPage={page} decrementPage={decrementPage} incrementPage={incrementPage} />
                {showAllTransactions}  
            </div>
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
