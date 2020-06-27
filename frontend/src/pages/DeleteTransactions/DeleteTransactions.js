import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactions } from '../../redux/actions';
import { isEmpty } from '../../utilities';


const DeleteTransactions = (props) => {
    const { id: accountId } = props.match.params;
    const { transactions={location: {data: ''}} } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        const execDeleteTransactions = async () => {
            const deleteStatus =  await dispatch(deleteTransactions(transactions, accountId));
            
            if (deleteStatus.success && !isEmpty(transactions.location.data)) {
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
