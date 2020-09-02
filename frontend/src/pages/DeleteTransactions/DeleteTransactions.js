import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactions } from '../../redux/actions';


const DeleteTransactions = (props) => {
    const { id: accountId, transactionId } = props.match.params;
    const dispatch = useDispatch();

    useEffect(() => {
        if (transactionId) {
            const execDeleteTransactions = async () => {
                await dispatch(deleteTransactions([transactionId], accountId));
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
