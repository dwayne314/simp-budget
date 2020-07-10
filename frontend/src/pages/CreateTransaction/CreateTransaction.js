import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import './CreateTransaction.css';
import Form from '../../components/Form/Form';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import { setErrors, postTransaction, add_transactions, postRecurringTransaction } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { newTransactiontValidator, newRecurringTransactionValidator } from '../../utilities';


const CreateTransaction = (props) => {
    // Recurring Transaction Options
    const monthlyScheduledDayOptions = Array.from(Array(31), (_, i) => i + 1);
    // const weeklyScheduledDayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Convert to weeks
    const weeklyScheduledDayOptions = [1,2,3,4,5,6,7]
    const allFrequencyOptions = [1, 2, 3, 4];
    const allSpecialDayOptions = ['first', 'last'];

    const { id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    // Recurring Transaction State Objects
    const [transactionTypeOptions, setTransactionTypeOptions] = useState(['daily', 'weekly', 'monthly']);
    const [frequencyOptions, setFrequencyOptions] = useState(allFrequencyOptions)
    const [specialDayOptions, setSpecialDayOptions] = useState(allSpecialDayOptions)
    const [scheduledDayOptions, setScheduledDayOptions] = useState(weeklyScheduledDayOptions.concat(monthlyScheduledDayOptions))

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [transactionType, setTransactionType] = useState();
    const [frequency, setFrequency] = useState();
    const [scheduledDay, setScheduledDay] = useState();
    const [specialDay, setSpecialDay] = useState();
    const [transactionErrors, setTransactionErrors] = useState('');
    const [isRecurringTransaction, setRecurringTransaction] = useState(false);
    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);
    const updateDate = date => setDate(date);
    const updateTransactionType = value => setTransactionType(value);
    const updateFrequency = value => setFrequency(value);
    const updateSpecialDay = value => setSpecialDay(value);
    const updateScheduledDay = value => setScheduledDay(value);

    // Adds the transaction to the state and redirects to the account
    const submitForm = async (e) => {
        e.preventDefault();
        setTransactionErrors('');
        dispatch(setErrors({}));

        const transactionAttrs = !isRecurringTransaction ? { amount, note, date } : { amount, note, transactionType, frequency, scheduledDay, specialDay}
        const { errors, result, isValid } = !isRecurringTransaction ? newTransactiontValidator(transactionAttrs) : newRecurringTransactionValidator(transactionAttrs);
        
        if (isValid) {
            let submitAction;

            if (!isRecurringTransaction) {
                submitAction = await dispatch(postTransaction(result, accountId));
            } else {
                submitAction = await dispatch(postRecurringTransaction(result, accountId))
            }

            if (!submitAction.success) {
                setTransactionErrors(submitAction.error);
            }
            else {
                if (!isRecurringTransaction) {
                    dispatch(add_transactions([submitAction.transaction]));
                }
                props.history.push(`/accounts/${accountId}/view`);
            }
        }
        else {
            dispatch(setErrors(errors));
        }
    };
    
    const formFields = isRecurringTransaction ? 
        [
            {name: "Toggle Transaction Type", id: "toggle-input", value: isRecurringTransaction, onChange: () => setRecurringTransaction(!isRecurringTransaction), inputType: "toggle"},
            {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType: "currency"},
            {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
            {name: "Transaction Type", value:transactionType, data: transactionTypeOptions, onChange:updateTransactionType, id: "transaction-type", errors: errors.transaction_type, inputType: "dropdown"},
            {name: "Frequency", value: frequency, data: frequencyOptions, onChange:updateFrequency, id: "frequency", errors: errors.frequency, inputType: "dropdown"},
            {name: "Scheduled Day", value: scheduledDay, data: scheduledDayOptions, onChange:updateScheduledDay, id: "scheduled-day", errors: errors.scheduled_day, inputType: "dropdown"},
            {name: "Special Day", value: specialDay, data: specialDayOptions, onChange:updateSpecialDay, id: "special-day", errors: errors.special_day, inputType: "dropdown"},
        ]
        :
        [
            {name: "Toggle Transaction Type", id: "toggle-input", value: isRecurringTransaction, onChange: () => setRecurringTransaction(!isRecurringTransaction), inputType: "toggle"},
            {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType:"currency"},
            {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
            {name: "Date", value: date, onChange:updateDate, id: "date", errors: errors.date, inputType:"date"}
        ];

    useEffect(() => {
        setFrequency('');
        setScheduledDay('');
        setSpecialDay('');

        if (transactionType === 'daily') {
            setFrequencyOptions([1]);
            setScheduledDayOptions([1]);
            setSpecialDayOptions([]);
            setFrequency(1);
            setScheduledDay(1);
        }
        else if (transactionType === 'weekly') {
            setFrequencyOptions(allFrequencyOptions);
            setScheduledDayOptions(weeklyScheduledDayOptions);
            setSpecialDayOptions([]);
        }
        else if (transactionType === 'monthly') {
            setFrequencyOptions(allFrequencyOptions);
            setScheduledDayOptions(monthlyScheduledDayOptions);
            setSpecialDayOptions(allSpecialDayOptions);
        }
    }, [transactionType])

    return (
        <div className="create-transaction-page-container">
            <Form formHeader={isRecurringTransaction ? 'New Recurring Transaction' : 'New Transaction'} 
                  fields={formFields} 
                  submit={submitForm} 
                  submitCTA={"Submit"}
                  formErrors={transactionErrors}/>
        </div>            
    );
};

export default CreateTransaction;
