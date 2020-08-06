import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactions } from '../../redux/actions';


const DeleteTransactions = (props) => {
    const { id: accountId } = props.match.params;
    const { data={data: {transactions: ''}} } = props.location;
    const dispatch = useDispatch();

    useEffect(() => {
        if (data.transactions) {
            const execDeleteTransactions = async () => {
                await dispatch(deleteTransactions(data.transactions, accountId));
                props.history.push(`/accounts/${accountId}/view`);
            }
            execDeleteTransactions();
        } else {
            props.history.push(`/accounts/${accountId}/view`);
        }
    })
    return null;
}

export default DeleteTransactions;
