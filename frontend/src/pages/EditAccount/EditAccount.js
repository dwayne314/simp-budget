import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageNotFound from '../PageNotFound/PageNotFound';
import Form from '../../components/Form/Form';
import { setErrors, patchAccount } from '../../redux/actions';
import { getErrors, getAccountById } from '../../redux/selectors';
import { newAccountValidator, isEmpty } from '../../utilities';
import './EditAccount.css';


const EditAccount = (props) => {
    const { id:accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId))) || '';
    const accountExists = !isEmpty(currentAccount);
    const dispatch = useDispatch();

    const errors = useSelector(getErrors);
    const [name, setName] = useState(currentAccount ? currentAccount.name : '');
    const [description, setDescription] = useState(currentAccount ? currentAccount.description : '');
    const [editAccountErrors, setEditAccountErrors] = useState('');

    const updateName = e => setName(e.target.value);
    const updateDescription = e => setDescription(e.target.value);

    const submitForm = async () => {
        const accountAttrs = { name, description };
        const { errors, result, isValid } = newAccountValidator(accountAttrs);

        if (isValid) {
            const submitAction = await dispatch(patchAccount(result, accountId));
            if (submitAction.success) {
                props.history.push(`/accounts/${accountId}/view`);
            }
            else {
                setEditAccountErrors(submitAction.error);
            }
        }
        else {
            dispatch(setErrors(errors));
        }
    };

    const formFields = [
        {name: "Name", value: name, onChange:updateName, id: "name", errors: errors.name},
        {name: "Description", value: description, onChange:updateDescription, id: "description", errors: errors.description}
    ];

    return (
        (!accountExists) ? <PageNotFound />
        :
        <div className="edit-account-page-container">
            <Form formHeader="Edit Account" 
                  fields={formFields} 
                  submit={submitForm} 
                  submitCTA={"Submit"} 
                  formErrors={editAccountErrors}/>
        </div>
    );
};

export default EditAccount;
