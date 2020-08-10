import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '../PageNotFound/PageNotFound';
import Paginator from '../../components/Paginator/Paginator';
import Button from '../../components/Button/Button';
import SearchForm from '../../components/SearchForm/SearchForm';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Icon from '../../components/Icon/Icon';

import { 
    getAccountById,
    getTransactionsByAccountId,
    getRecurringTransactionsByAccountId
} from '../../redux/selectors';
import { formatUSD, formatDateUTC, isEmpty, mapOrdinalIndicators, getWeekDayFromIndex } from '../../utilities';

import addIcon from '../../static/icons/plus-button.svg';
import searchIcon from '../../static/icons/magnifying-glass.svg';
import editIcon from '../../static/icons/edit-pencil.svg';
import editIconDisabled from '../../static/icons/edit-pencil-grey.svg';
import deleteIcon from '../../static/icons/trash-can-grey.svg';
import deleteIconClickable from '../../static/icons/trash-can-red.svg';
import './ViewAccount.css';


const ViewAccount = (props) => {
    const { id:accountId } = props.match.params;

    // Sets current account to an empty string if one is not available
    let currentAccount = useSelector(state => getAccountById(state)(Number(accountId))) || '';
    const accountExists = !isEmpty(currentAccount);
    const transactions = useSelector(state => getTransactionsByAccountId(state)(Number(accountId)));
    const recurringTransactions = useSelector(state => getRecurringTransactionsByAccountId(state)(Number(accountId)));
    const accountBalance = transactions.reduce((acc, tran) => acc + tran.amount, 0);
    const [searchText, setSearchText] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [selectTransactionToggle, setSelectTransactionToggle] = useState(false);
    const [page, setPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [isRecurringTransactions, setRecurringTransactions] = useState(false);

    // Stores filtered transactions so the unfiltered transactions will not be modified
    const filteredTransactions = transactions
        .filter(tran => tran.note.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    const filteredRecurringTransactions = recurringTransactions
        .filter(tran => tran.note.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

    // Configurations to affect the display of the transactions and icons
    const visibleTransactionDays = 5;
    const recurringTransactionsSortOrder = ['daily', 'weekly', 'monthly'];    
    const clickableTrash = (!selectTransactionToggle) || (selectTransactionToggle && selectedTransactions.length > 0);
    const clickableEdit = (!selectTransactionToggle) || (selectTransactionToggle && selectedTransactions.length === 1);
    
    // Transaction Mappers to convert transactions into sortaable keys
    const transactionMapper = filteredTransactions.reduce((acc, tran) => {
        if (!acc[formatDateUTC(tran.date, 'yyyy-mm-dd')]) {
            acc[formatDateUTC(tran.date, 'yyyy-mm-dd')] = [tran];
        }
        else if (acc[formatDateUTC(tran.date, 'yyyy-mm-dd')]) {
            acc[formatDateUTC(tran.date, 'yyyy-mm-dd')].push(tran);
        }
        return acc;
    }, {});

    const recurringTransactionMapper = filteredRecurringTransactions.reduce((acc, tran) => {
        if (!acc[tran.transaction_type]) {
            acc[tran.transaction_type] = [tran];
        } else {
            acc[tran.transaction_type].push(tran);
        }
        return acc;
    }, {});

    // All recurring transactions will be on the same page
    const pages = Math.ceil((!isRecurringTransactions ? (Object.keys(transactionMapper).length): visibleTransactionDays) / visibleTransactionDays);
    const toggleSearch = () => setIsSearching(isSearching ? false : true);
    const decrementPage = () => setPage(page > 1 ? page - 1 : page);
    const incrementPage = () => setPage(page < pages ? page + 1 : page);
    const updateSearchText = (evt) => setSearchText(evt.target.value);
    
    // Page Toggles
    const toggleRecurringTransaction = () => {
        // Stops selecting transactions when the toggle is switched 
        setSelectedTransactions([]);
        setSelectTransactionToggle(false);
        setRecurringTransactions(isRecurringTransactions ? false : true);
    }
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

    // Sorts and creates elements from transactions
    const showAllTransactions = Object.keys(transactionMapper)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((tranDate, dateIndex) => {
            const transactions = transactionMapper[tranDate].flat().map(tran => {
                let transactionClasses = `view-account-transaction-container${(selectedTransactions.indexOf(tran.id) !== -1) ? ' selected-transaction' : ''}`
                transactionClasses = transactionClasses + `${selectTransactionToggle ? ' selectable-transaction' : ''}` 

                return (
                    <div key={tran.id} onClick={selectTransactionToggle ? () => toggleSelection(tran.id) : null} 
                          className={transactionClasses}>
                        <div className="view-account-transaction-header">
                            <div className="view-account-transaction-note">{tran.note}</div>
                            <div className="view-account-transaction-amount">{formatUSD(tran.amount)}</div>
                        </div>
                    </div>
                )
            });
            return (
                <div key={`date-${dateIndex}`} className="view-account-transaction-date-container">
                    <div className="view-account-transaction-date">
                        {tranDate}
                    </div>
                    {transactions}
                </div>
            );
    }).slice((page-1) * visibleTransactionDays, visibleTransactionDays * page);

    // Sorted in daily, weekly, monthly order
    const showAllRecurringTransactions = Object.keys(recurringTransactionMapper)
        .sort((a, b) => recurringTransactionsSortOrder.indexOf(a) - recurringTransactionsSortOrder.indexOf(b))
        .map((tranType, tranTypeIndex) => {
            const recurringTransaction = recurringTransactionMapper[tranType].map(tran => {
                let transactionClasses = `view-account-transaction-container${(selectedTransactions.indexOf(tran.id) !== -1) ? ' selected-transaction' : ''}`
                transactionClasses = transactionClasses + `${selectTransactionToggle ? ' selectable-transaction' : ''}` 

                return (
                    <div 
                        key={`recurring-transaction-${tran.id}`}
                        className={transactionClasses}
                        onClick={selectTransactionToggle ? () => toggleSelection(tran.id) : null} >
                        <div className="view-account-transaction-header">
                            <div className="view-account-recurring-transaction-note">{tran.note}</div>
                            <div className="view-account-recurring-transaction-amount">{formatUSD(tran.amount)}</div>
                        </div>
                        {
                            tranType !== 'daily' ?
                                <div className="view-account-transaction-body">
                                    <div>Every 
                                    { tran.frequency === 1 ? "" : ` ${tran.frequency}` }
                                    {
                                        tranType === 'monthly' ? 
                                            ' month'
                                            :
                                            ' week'
                                    } 
                                    {
                                        tran.frequency > 1 ? 's on' : ' on'
                                    }
                                    {
                                        tranType === 'monthly' ? 
                                            ` the ${tran.scheduled_day ? mapOrdinalIndicators(tran.scheduled_day) : `${tran.special_day} day`}`
                                            : ` ${getWeekDayFromIndex(tran.scheduled_day)}`
                                    }
                                    </div>                
                                </div>
                            :
                            ""
                        }            
                    </div>
                )
            }).slice((page-1) * visibleTransactionDays, visibleTransactionDays * page);

            return (
                <div key={`recurring-transaction-type-${tranTypeIndex}`} className="view-account-transaction-date-container">
                    <div className="view-account-transaction-date">
                        {tranType}
                    </div>
                    {recurringTransaction}
                </div>
            );
        })
    
    const searchForm = isSearching ? 
        <Fragment>
            <SearchForm onChange={updateSearchText} searchText={searchText} placeholder="Search Transactions"/>
            <div className="toggle-switch-container">
                <span>Toggle Recurring Transactions</span>
                <span className="toggle-switch-label-container">
                    <ToggleSwitch 
                        id={'field.id'}
                        isToggled={isRecurringTransactions} 
                        handleToggle={toggleRecurringTransaction}/>
                </span>
            </div>
        </Fragment>
        :
        "";

    return (
        (!accountExists) ? <PageNotFound />
        :
        <div className="view-account-container">
            <div className="view-account-body-container">
                <div className="view-account-header-container">
                    <div className="view-account-header-text">{currentAccount.name}</div>
                    <div className="account-balance">{formatUSD(accountBalance)}</div>
                </div>
                <div className="account-description-container">
                    {currentAccount.description}
                </div>
                <div className="account-actions-container">
                    <div className="account-actions-sub-container">
                        <Icon type={addIcon} alt="plus-icon" linkPath={`/accounts/${currentAccount.id}/transactions/create`}/>
                        <Icon
                            type={searchIcon} 
                            alt="magnifying-glass"
                            onClick={toggleSearch}
                        />
                        <Icon 
                            type={clickableEdit ? editIcon : editIconDisabled}
                            alt="writing-pencil"
                            unClickable={!clickableEdit}
                            linkPath={() => {
                                if (!selectTransactionToggle) {
                                    return `/accounts/${currentAccount.id}/edit`
                                }
                                else if (selectTransactionToggle && selectedTransactions.length === 1) {
                                    const selectedTransactionId = selectedTransactions[0];
                                    return `/accounts/${currentAccount.id}/${!isRecurringTransactions ? 'transactions' : 'recurringTransactions'}/${selectedTransactionId}/edit`
                                }
                                else {
                                    return null
                                }}}
                        />
                        <Icon
                            type={clickableTrash ? deleteIconClickable : deleteIcon}
                            alt="trash-can"
                            unClickable={!clickableTrash}
                            linkPath={() => {
                                if (!selectTransactionToggle) {
                                    return `/accounts/${currentAccount.id}/delete`
                                }
                                else if (selectTransactionToggle && selectedTransactions.length) {
                                    return `/accounts/${currentAccount.id}/${!isRecurringTransactions ? 'transactions' : 'recurringTransactions'}/delete`
                                }
                                else {
                                    return null
                                }
                            }}
                            data={{transactions: selectedTransactions, accountId}}                                
                        />

                    </div>
                </div>       
                {searchForm} 
                <Paginator pageCount={pages === 0 ? 1 : pages} currentPage={page} decrementPage={decrementPage} incrementPage={incrementPage} />
                {!isRecurringTransactions ? showAllTransactions : showAllRecurringTransactions}  
            </div>
            <div className="modify-account-transaction-floating-buttons">
                {!selectTransactionToggle ? 
                    <Fragment>
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
