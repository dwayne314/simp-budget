import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccount } from '../../redux/actions';
import { getAccountById } from '../../redux/selectors';


const DeleteAccount = (props) => {
    const { id: accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId))) || '';

    const dispatch = useDispatch();

    const execDeleteAccount = async () => {
        await dispatch(deleteAccount(accountId, currentAccount.name));
        props.history.push('/accounts');
    }

    useEffect(() => {
        execDeleteAccount();
    }, [])
    return null;
}

export default DeleteAccount;
