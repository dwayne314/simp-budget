import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CreateTransaction.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import { setErrors, postTransaction, add_transactions } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { newTransactiontValidator } from '../../utilities';


const CreateTransaction = (props) => {
    const { id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);


    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [transactionErrors, setTransactionErrors] = useState('');

    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);

    // Adds the transaction to the state and redirects to the account
    const submitForm = async (e) => {
        e.preventDefault();
        setTransactionErrors('');
        dispatch(setErrors({}));

        const transactionAttrs = { amount, note };
        const { errors, result, isValid } = newTransactiontValidator(transactionAttrs);

        if (isValid) {
            const submitAction = await dispatch(postTransaction(result, accountId));
            if (!submitAction.success) {
                setTransactionErrors(submitAction.error);
            }
            else {
                dispatch(add_transactions([submitAction.transaction]));
                props.history.push(`/accounts/${accountId}/view`);
            }
        }
        else {
            dispatch(setErrors(errors));            
        }
    };

    return (
        <div className="new-transaction-container">

            <div className="new-transaction-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="new-transaction-form-container">
                <div className="new-transaction-form-header">
                    New Transaction
                </div>
                {transactionErrors ? 
                    <div className="transaction-errors-container">
                        <div className="transaction-errors">{`${transactionErrors}`}</div>
                    </div>
                    :
                    ""
                }                
                <div className="new-transaction-form">
                    
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
                        <div className="form-item-container form-button-container">
                            <Button onClick={submitForm} cta={"Submit"} isPrimary={false}/>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default CreateTransaction;
