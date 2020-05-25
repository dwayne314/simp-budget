import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactions } from '../../redux/actions';


const DeleteTransactions = (props) => {
    const { id: accountId } = props.match.params;
    const { transactions } = props.location.data;
    const dispatch = useDispatch();


    useEffect(() => {
        const execDeleteTransactions = async () => {
            const deleteStatus =  await dispatch(deleteTransactions(transactions, accountId));
            
            if (deleteStatus.success) {
                // flash success message here
                console.log('Transactions Deleted');
            }
            else {
                // flash failure message here
                console.log(deleteStatus.error);
            }

            props.history.push(`/accounts/${accountId}/view`);
        }

        execDeleteTransactions();
    })
    return null;
}

export default DeleteTransactions;
