import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import { 
    getAccountById,
    getTransactionsByAccountId,
    // getLocalDate
} from '../../redux/selectors';
import PageNotFound from '../PageNotFound/PageNotFound';
import { formatUSD, formatDate } from '../../utilities';
import addIcon from '../../static/icons/plus-button.svg';
import editIcon from '../../static/icons/edit-pencil.svg';
import deleteIcon from '../../static/icons/trash-can-red.svg';
import Icon from '../../components/Icon/Icon';
import LongRightArrow from '../../static/icons/right-arrow-long.svg';
import LongLeftArrow from '../../static/icons/left-arrow-long.svg';
import './ViewTransaction.css';


const ViewTransaction = (props) => {

    const { id:accountId, transactionId } = props.match.params;
    const emptyAccount = {account_id: ''};

    // Retrieves the transactions from the account Id so only transactions for this account are available
    const transactions = useSelector(state => getTransactionsByAccountId(state)(Number(accountId)))
        .sort((a, b) => a.id - b.id);

    const transaction = transactions.find(tran => tran.id === Number(transactionId)) || emptyAccount;
    const account = useSelector(state => getAccountById(state)(transaction.account_id));
    const transactionExists = transaction !== emptyAccount;

    const incrementTransaction = () => {
        const nextTransaction = transactions.find((tran, index) => {
            return tran.id > transaction.id
        });
        if (nextTransaction){
            props.history.push(`/accounts/${accountId}/transactions/${nextTransaction.id}/view`)
        }
    };
    const decrementTransaction = () => {
        const lastTransaction = transactions.reverse().find((tran, index) => {
            return tran.id < transaction.id
        });
        if (lastTransaction) {
            props.history.push(`/accounts/${accountId}/transactions/${lastTransaction.id}/view`)
        }
    };

    return (
        (!transactionExists) ? <PageNotFound />
        :
        <div className="view-transaction-container">
            <div className="view-transaction-body-header ">
                <div className="page-header-container">
                    <div className="view-transaction-description">
                        {account.name}
                    </div>
                    <div className="transaction-balance">
                        {formatUSD(transaction.amount)}
                    </div>
                </div>
                <div className="domain-actions-container">
                    <div className="domain-actions-sub-container">
                        <Icon type={addIcon} alt="plus-icon" linkPath={`/accounts/${account.id}/transactions/create`}/>
                        <Icon 
                            type={editIcon}
                            alt="writing-pencil"
                            linkPath={`/accounts/${account.id}/transactions/${transaction.id}/edit`}
                        />
                         <Icon
                            type={deleteIcon}
                            alt="trash-can"
                            linkPath={`/accounts/${account.id}/transactions/${transaction.id}/delete`}
                        />
                    </div>
                </div>
                <div className="view-transaction-details-container">
                    <div className="view-transaction-details-section-container">
                        <div className="view-transaction-details-section">
                            <div className="view-transaction-details-header">
                                Description
                            </div>
                            <div className="view-transaction-details-body">
                                {transaction.note}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="view-transaction-change-page-container">
                    <div className="view-transaction-change-transaction-header">
                        {formatDate(transaction.date, 'yyyy-mm-dd')}
                    </div>
                    <div className="view-transaction-change-page-section">
                        <div className="view-transaction-change-page iew-transaction-change-page-left">
                            <div className="view-transaction-change-page-button-text">
                                Previous Page
                            </div>
                            <div onClick={decrementTransaction} className="view-transaction-change-page-button">
                                <img src={LongLeftArrow} alt="left-arrow"/>
                            </div>                    
                        </div>
                        <div className="view-transaction-change-page view-transaction-next-page-right">
                            <div className="view-transaction-change-page-button-text">
                                Next Page
                            </div>
                            <div onClick={incrementTransaction} className="view-transaction-change-page-button">
                                <img src={LongRightArrow} alt="right-arrow"/>
                            </div>
                        </div>   
                    </div>
                </div>    
            </div>
             <div className="modify-account-transaction-floating-buttons">
                <Button onClick={() => props.history.push(`/accounts/${accountId}/view`)} isPrimary={true} cta={"Back To Account"}/>
            </div>
        </div>
    );
}


export default ViewTransaction;
