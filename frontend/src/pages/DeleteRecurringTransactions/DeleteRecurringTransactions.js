import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteRecurringTransactions } from '../../redux/actions';


const DeleteRecurringTransactions = (props) => {
    const { id: accountId } = props.match.params;
    const { data={data: {transactions: ''}} } = props.location;
    const dispatch = useDispatch();

    useEffect(() => {
        if (data.transactions) {
            const execDeleteRecurringTransactions = async () => {
                await dispatch(deleteRecurringTransactions(data.transactions, accountId));
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
