import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteRecurringTransactions } from '../../redux/actions';


const DeleteRecurringTransactions = (props) => {
    const { id: accountId, recurringTransactionId } = props.match.params;
    const dispatch = useDispatch();

    useEffect(() => {
        if (recurringTransactionId) {
            const execDeleteRecurringTransactions = async () => {
                await dispatch(deleteRecurringTransactions([recurringTransactionId], accountId));
                props.history.push(`/accounts/${accountId}/view`);
            }
            execDeleteRecurringTransactions();
        } else {
            props.history.push(`/accounts/${accountId}/view`);
        }
    })
    return null;
}

export default DeleteRecurringTransactions;
