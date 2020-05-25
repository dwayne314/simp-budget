import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteAccount } from '../../redux/actions';


const DeleteAccount = (props) => {
    const { id: accountId } = props.match.params;
    const dispatch = useDispatch();


    useEffect(() => {
        const execDeleteAccount = async () => {
            const deleteStatus =  await dispatch(deleteAccount(accountId));
            
            if (deleteStatus.success) {
                // flash success message here
                console.log('Account Deleted');
            }
            else {
                // flash failure message here
                console.log(deleteStatus.error);
            }

            props.history.push('/accounts');

        }

        execDeleteAccount();
    })
    return null;
}

export default DeleteAccount;
