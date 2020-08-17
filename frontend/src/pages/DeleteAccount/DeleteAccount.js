import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccount } from '../../redux/actions';
import { getAccountById } from '../../redux/selectors';
import SafeDelete from '../../components/SafeDelete/SafeDelete';


const DeleteAccount = (props) => {
    const { id: accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId))) || '';

    const dispatch = useDispatch();


    const execDeleteAccount = async () => {
        await dispatch(deleteAccount(accountId, currentAccount.name));
        props.history.push('/accounts');
    };

    const execStopAccountdeletion = () => {
        props.history.push(`/accounts/${accountId}/view`);

    }

    return (
        <SafeDelete 
            domain="account" 
            safeDelete={execDeleteAccount} 
            unsafeDelete={execStopAccountdeletion}
        />)
}

export default DeleteAccount;
