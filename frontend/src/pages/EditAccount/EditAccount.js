import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './EditAccount.css';
import Form from '../../components/Form/Form';
import { setErrors, patchAccount } from '../../redux/actions';
import { getErrors, getAccountById } from '../../redux/selectors';
import { newAccountValidator } from '../../utilities';


const EditAccount = (props) => {
    const { id:accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId)));

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
                console.log(`Account ${result.name} edited.`)
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
        <Fragment>
            <div className="edit-account-page-container">
                <Form formHeader="Edit Account" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Submit"} 
                      formErrors={editAccountErrors}/>
            </div>
        </Fragment>
    );
};

export default EditAccount;
