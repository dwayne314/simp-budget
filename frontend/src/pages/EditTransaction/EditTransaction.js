import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageNotFound from '../PageNotFound/PageNotFound';
import Form from '../../components/Form/Form';
import { setErrors, patchTransaction } from '../../redux/actions';
import { getErrors, getTransactionById } from '../../redux/selectors';
import { newTransactiontValidator, getLocalDate } from '../../utilities';
import './EditTransaction.css';


const EditTransaction = (props) => {
    const { transactionId, id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const currentTransaction = useSelector(state => getTransactionById(state)(Number(transactionId)));
    const accountTransactionExists = currentTransaction && Number(currentTransaction.account_id) === Number(accountId);
    const [amount, setAmount] = useState(currentTransaction ? (currentTransaction.amount / 100).toFixed(2) : '');
    const [note, setNote] = useState(currentTransaction ? currentTransaction.note : '');
    const [date, setDate] = useState(currentTransaction ? getLocalDate(currentTransaction.date) : '');
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
    
    const formFields = [
        {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType:"currency"},
        {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
        {name: "Date", value: date, onChange:updateDate, id: "date", errors: errors.date, inputType:"date"}
    ];

    return (
        (!accountTransactionExists) ?
        <PageNotFound />
        :
        <div className="edit-transaction-container">
            <Form formHeader="Edit Transaction" 
                  fields={formFields} 
                  submit={submitForm} 
                  submitCTA={"Submit"}
                  formErrors={transactionErrors}/>
        </div>            
    );
};

export default EditTransaction;
