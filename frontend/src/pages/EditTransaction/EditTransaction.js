import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import './EditTransaction.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { setErrors, patchTransaction } from '../../redux/actions';
import { getErrors, getTransactionById } from '../../redux/selectors';
import { newTransactiontValidator, getLocalDate } from '../../utilities';


const EditTransaction = (props) => {
    const { transactionId, id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const currentTransaction = useSelector(state => getTransactionById(state)(Number(transactionId)));
    const [amount, setAmount] = useState((currentTransaction.amount / 100).toFixed(2));
    const [note, setNote] = useState(currentTransaction.note);
    const [date, setDate] = useState(getLocalDate(currentTransaction.date));
    const [transactionErrors, setTransactionErrors] = useState('');

    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);
    const updateDate = date => setDate(date);

    // Adds the transaction to the state and redirects to the account
    const submitForm = async (e) => {
        e.preventDefault();
        setTransactionErrors('');
        dispatch(setErrors({}));

        const transactionAttrs = { amount, note, date};
        const { errors, result, isValid } = newTransactiontValidator(transactionAttrs);

        if (isValid) {
            const submitAction = await dispatch(patchTransaction(result, accountId, transactionId));
            if (!submitAction.success) {
                setTransactionErrors(submitAction.error);
            }
            else {
                props.history.push(`/accounts/${accountId}/view`);
            }
        }
        else {
            dispatch(setErrors(errors));            
        }
    };    
    return (
        <div className="edit-transaction-container">

            <Header formHeader={true}/>
            <div className="edit-transaction-form-container">
                <div className="edit-transaction-form-header">
                    Edit Transaction
                </div>
                {transactionErrors ? 
                    <div className="transaction-errors-container">
                        <div className="transaction-errors">{`${transactionErrors}`}</div>
                    </div>
                    :
                    ""
                }                
                <div className="edit-transaction-form">
                    
                    <form>
                       <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="amount">Amount</label>
                            </div>
                            <div className="form-input">
                                <input className="currency-input" onChange={updateAmount} type="number" id="amount" value={amount}/>
                                <span className="currency-indicator">$</span>
                            </div>
                            {(errors.amount) ? <span className="login-error">{`* ${errors.amount}`}</span> : ""}

                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="note">Note</label>
                            </div>
                            <div className="form-input">
                                <input onChange={updateNote} type="text" id="note" value={note}/>
                            </div>
                            {(errors.note) ? <span className="login-error">{`* ${errors.note}`}</span> : ""}

                        </div>
                         <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="date">Date</label>
                            </div>
                            <div className="date-picker-container">
                                <DatePicker
                                    selected={date}
                                    onChange={date => updateDate(date)}
                                    dateFormat='MMMM d, yyyy'>
                                </DatePicker>
                            </div>
                            {(errors.date) ? <span className="login-error">{`* ${errors.date}`}</span> : ""}
                        </div>
                        <div className="form-item-container form-button-container">
                            <Button onClick={submitForm} cta={"Submit"} isPrimary={false}/>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default EditTransaction;
