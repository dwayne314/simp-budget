import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import './CreateTransaction.css';
import Form from '../../components/Form/Form';
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
    const [date, setDate] = useState(new Date());

    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);
    const updateDate = date => setDate(date);
    // Adds the transaction to the state and redirects to the account
    const submitForm = async (e) => {
        e.preventDefault();
        setTransactionErrors('');
        dispatch(setErrors({}));

        const transactionAttrs = { amount, note, date };
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
    
    const formFields = [
        {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType:"currency"},
        {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
        {name: "Date", value: date, onChange:updateDate, id: "date", errors: errors.date, inputType:"date"}
    ];

    return (
        <Fragment>
            <div className="create-transaction-page-container">
                <Form formHeader="New Transaction" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Submit"}
                      formErrors={transactionErrors}/>
            </div>            
        </Fragment>
    );
};

export default CreateTransaction;
