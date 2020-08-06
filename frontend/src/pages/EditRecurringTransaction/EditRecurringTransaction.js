import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageNotFound from '../PageNotFound/PageNotFound';
import Form from '../../components/Form/Form';
import { setErrors, patchRecurringTransaction } from '../../redux/actions';
import { getErrors, getRecurringTransactionById } from '../../redux/selectors';
import {
    newRecurringTransactionValidator,
    getWeekDayFromIndex,
    getWeeklyFrequencyFromIndex,
    getMonthDayFromIndex,
    getMonthlyFrequencyFromIndex,
    getSpecialDayFromIndex,
} from '../../utilities';
import './EditRecurringTransaction.css';


const EditRecurringTransaction = (props) => {
    const { recurringTransactionId, id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    // Recurring transaction details
    const recurringTransaction = useSelector(state => getRecurringTransactionById(state)(Number(recurringTransactionId)));
    const accountTransactionExists = recurringTransaction && Number(recurringTransaction.account_id) === Number(accountId);
    const [amount, setAmount] = useState(recurringTransaction ? (recurringTransaction.amount / 100).toFixed(2) : '');
    const [note, setNote] = useState(recurringTransaction ? recurringTransaction.note : '');
    const [transactionType, setTransactionType] = useState(recurringTransaction.transaction_type);
    const [frequencyIndex, setFrequencyIndex] = useState(getWeeklyFrequencyFromIndex(recurringTransaction.frequency));
    const [scheduledDayIndex, setScheduledDayIndex] = useState(getWeekDayFromIndex(recurringTransaction.scheduled_day));
    const [specialDayIndex, setSpecialDayIndex] = useState(getSpecialDayFromIndex(recurringTransaction.special_day));
    const [transactionErrors, setTransactionErrors] = useState('');
    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);
    const updateTransactionType = value => setTransactionType(value);
    const updateFrequencyIndex = value => setFrequencyIndex(value);
    const updateSpecialDayIndex = value => setSpecialDayIndex(value);
    const updateScheduledDayIndex = value => setScheduledDayIndex(value);

    // Static objects that remain between renders
    const changedTransaction = useRef(false);
    const initialTransactionType = useRef(transactionType);

    // Dynamic options determined by other form fields
    const [frequencyIndexOptions, setFrequencyIndexOptions] = useState([]);
    const [specialDayIndexOptions, setSpecialDayIndexOptions] = useState([]);
    const [scheduledDayIndexOptions, setScheduledDayIndexOptions] = useState([]);

    // Hidden Field Configs
    const hiddenFrequency = (
        (transactionType === undefined) ||
        (transactionType === 'daily')
        );
    const hiddenScheduledDayIndex = (
        (transactionType === undefined) ||
        (transactionType === 'daily') ||
        (transactionType === 'monthly' && Boolean(specialDayIndex))
        );
    const hiddenSpecialDay = (
        (transactionType === undefined) ||
        (transactionType !== 'monthly') || 
        (transactionType === 'monthly' && Boolean(scheduledDayIndex))
        );

    // Clear field functions
    const clearScheduledDay = () => updateScheduledDayIndex('');
    const clearSpecialDay = () => updateSpecialDayIndex('');


    // Recurring Transaction Options
    const allSpecialDayIndexOptions = useRef(['first day of the month', 'last day of the month']);
    const monthlyScheduledDayIndexOptions = useRef([
        '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
        '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th',
        '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th',
        '29th', '30th', '31st'])
    const weeklyScheduledDayIndexOptions = useRef(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const weeklyFrequencyIndexOptions = useRef(['every 1 week', 'every 2 weeks', 'every 3 weeks', 'every 4 weeks']);
    const monthlyFrequencyIndexOptions = useRef(['every 1 month', 'every 2 months', 'every 3 months', 'every 4 months']);
    const transactionTypeOptions= useRef(['daily', 'weekly', 'monthly']);

    // Adds the transaction to the state and redirects to the account
    const submitForm = async (e) => {
        e.preventDefault();
        setTransactionErrors('');
        dispatch(setErrors({}));

        // Create the scheduled day, frequency, and special day from their indexes
        let scheduledDay;
        let frequency;
        let specialDay;

        if (transactionType === 'weekly') {
            scheduledDay = getWeekDayFromIndex(scheduledDayIndex);
            frequency = getWeeklyFrequencyFromIndex(frequencyIndex);
        } else if (transactionType === 'monthly') {
            scheduledDay = getMonthDayFromIndex(scheduledDayIndex);
            frequency = getMonthlyFrequencyFromIndex(frequencyIndex);
            specialDay = getSpecialDayFromIndex(specialDayIndex);
        } else {
            scheduledDay = scheduledDayIndex;
            frequency = frequencyIndex;
        };
        const transactionAttrs = { amount, note, transactionType, frequency, scheduledDay, specialDay}
        const { errors, result, isValid } = newRecurringTransactionValidator(transactionAttrs);

        if (isValid) {
            const submitAction = await dispatch(patchRecurringTransaction(result, accountId, recurringTransactionId));
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
            {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType: "currency"},
            {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
            {name: "Transaction Type", value:transactionType, data: transactionTypeOptions.current, onChange:updateTransactionType, id: "transaction-type", errors: errors.transaction_type, inputType: "dropdown"},
            {name: "Frequency", value: frequencyIndex, data: frequencyIndexOptions, onChange:updateFrequencyIndex, id: "frequency", errors: errors.frequency, inputType: "dropdown", isHidden:hiddenFrequency},
            {name: "Scheduled Day", value: scheduledDayIndex, data: scheduledDayIndexOptions, onChange:updateScheduledDayIndex, id: "scheduled-day", errors: errors.scheduled_day, inputType: "dropdown", isHidden:hiddenScheduledDayIndex, clearBtn:true, onClear:clearScheduledDay},
            {name: "Special Day", value: specialDayIndex, data: specialDayIndexOptions, onChange:updateSpecialDayIndex, id: "special-day", errors: errors.special_day, inputType: "dropdown", isHidden:hiddenSpecialDay, clearBtn:true, onClear:clearSpecialDay},
    ];

    useEffect(() => {

        if (changedTransaction.current || initialTransactionType.current !== transactionType) {
            setFrequencyIndex('');
            setScheduledDayIndex('');
            setSpecialDayIndex('');
            changedTransaction.current = true
        }

        if (transactionType === 'daily') {
            setFrequencyIndexOptions([1]);
            setScheduledDayIndexOptions([1]);
            setSpecialDayIndexOptions([]);
            setFrequencyIndex(1);
            setScheduledDayIndex(1);
        }
        else if (transactionType === 'weekly') {

            setFrequencyIndexOptions(weeklyFrequencyIndexOptions.current);
            setScheduledDayIndexOptions(weeklyScheduledDayIndexOptions.current);
            setSpecialDayIndexOptions([]);
        }
        else if (transactionType === 'monthly') {
            setFrequencyIndexOptions(monthlyFrequencyIndexOptions.current);
            setScheduledDayIndexOptions(monthlyScheduledDayIndexOptions.current);
            setSpecialDayIndexOptions(allSpecialDayIndexOptions.current);
        }
    }, [transactionType]);

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

export default EditRecurringTransaction;
