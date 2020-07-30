import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import './CreateTransaction.css';
import Form from '../../components/Form/Form';
import {
    setErrors,
    postTransaction,
    add_transactions,
    postRecurringTransaction
} from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import {
    newTransactiontValidator,
    newRecurringTransactionValidator,
    getWeekDayFromIndex,
    getMonthDayFromIndex,
    getWeeklyFrequencyFromIndex,
    getMonthlyFrequencyFromIndex,
    getSpecialDayFromIndex
} from '../../utilities';


const CreateTransaction = (props) => {
    const { id: accountId } = props.match.params;
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [transactionType, setTransactionType] = useState();
    const [frequencyIndex, setFrequencyIndex] = useState();
    const [scheduledDayIndex, setScheduledDayIndex] = useState();
    const [specialDayIndex, setSpecialDayIndex] = useState();
    const [transactionErrors, setTransactionErrors] = useState('');
    const [isRecurringTransaction, setRecurringTransaction] = useState(false);
    const updateAmount = e => setAmount(e.target.value);
    const updateNote = e => setNote(e.target.value);
    const updateDate = date => setDate(date);
    const updateTransactionType = value => setTransactionType(value);
    const updateFrequencyIndex = value => setFrequencyIndex(value);
    const updateSpecialDayIndex = value => setSpecialDayIndex(value);
    const updateScheduledDayIndex = value => setScheduledDayIndex(value);


    // Recurring Transaction Options
    const allSpecialDayIndexOptions = ['first day of the month', 'last day of the month'];
    const monthlyScheduledDayIndexOptions = [
        '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
        '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th',
        '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th',
        '29th', '30th', '31st'
    ];
    const weeklyScheduledDayIndexOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyFrequencyIndexOptions = ['every 1 week', 'every 2 weeks', 'every 3 weeks', 'every 4 weeks'];
    const monthlyFrequencyIndexOptions = ['every 1 month', 'every 2 months', 'every 3 months', 'every 4 months'];

    const [transactionTypeOptions, setTransactionTypeOptions] = useState(['daily', 'weekly', 'monthly']);
    const [frequencyIndexOptions, setFrequencyIndexOptions] = useState([]);
    const [specialDayIndexOptions, setSpecialDayIndexOptions] = useState([]);
    const [scheduledDayIndexOptions, setScheduledDayIndexOptions] = useState([]);

    // Hidden Fields
    const hiddenFrequency = (
        (transactionType === undefined) ||
        (transactionType === 'daily')
        );
    const hiddenScheduledDayIndex = (
        (transactionType === undefined) ||
        (transactionType === 'daily') ||
        (transactionType === 'monthly' && specialDayIndex !== '')
        );
    const hiddenSpecialDay = (
        (transactionType === undefined) ||
        (transactionType !== 'monthly') || 
        (transactionType === 'monthly' && scheduledDayIndex !== '')
        );

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
            {name: "Frequency", value: frequencyIndex, data: frequencyIndexOptions, onChange:updateFrequencyIndex, id: "frequency", errors: errors.frequency, inputType: "dropdown", isHidden:hiddenFrequency},
            {name: "Scheduled Day", value: scheduledDayIndex, data: scheduledDayIndexOptions, onChange:updateScheduledDayIndex, id: "scheduled-day", errors: errors.scheduled_day, inputType: "dropdown", isHidden:hiddenScheduledDayIndex},
            {name: "Special Day", value: specialDayIndex, data: specialDayIndexOptions, onChange:updateSpecialDayIndex, id: "special-day", errors: errors.special_day, inputType: "dropdown", isHidden:hiddenSpecialDay},
        ]
        :
        [
            {name: "Toggle Transaction Type", id: "toggle-input", value: isRecurringTransaction, onChange: () => setRecurringTransaction(!isRecurringTransaction), inputType: "toggle"},
            {name: "Amount", value: amount, onChange:updateAmount, id: "amount", errors: errors.amount, inputType:"currency"},
            {name: "Note", value: note, onChange:updateNote, id: "note", errors: errors.note},
            {name: "Date", value: date, onChange:updateDate, id: "date", errors: errors.date, inputType:"date"}
        ];

    useEffect(() => {
        setFrequencyIndex('');
        setScheduledDayIndex('');
        setSpecialDayIndex('');

        if (transactionType === 'daily') {
            setFrequencyIndexOptions([1]);
            setScheduledDayIndexOptions([1]);
            setSpecialDayIndexOptions([]);
            setFrequencyIndex(1);
            setScheduledDayIndex(1);
        }
        else if (transactionType === 'weekly') {
            setFrequencyIndexOptions(weeklyFrequencyIndexOptions);
            setScheduledDayIndexOptions(weeklyScheduledDayIndexOptions);
            setSpecialDayIndexOptions([]);
        }
        else if (transactionType === 'monthly') {
            setFrequencyIndexOptions(monthlyFrequencyIndexOptions);
            setScheduledDayIndexOptions(monthlyScheduledDayIndexOptions);
            setSpecialDayIndexOptions(allSpecialDayIndexOptions);
        }
    }, [transactionType]);

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
