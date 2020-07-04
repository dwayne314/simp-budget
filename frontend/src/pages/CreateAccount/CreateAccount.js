import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './CreateAccount.css';
import Form from '../../components/Form/Form';
import { setErrors, postAccount } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { newAccountValidator } from '../../utilities';


const CreateAccount = (props) => {
    const dispatch = useDispatch();

    const errors = useSelector(getErrors);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [newAccountError, setNewAccountError] = useState('');

    const updateName = e => setName(e.target.value);
    const updateDescription = e => setDescription(e.target.value);

    const submitForm = async () => {
        const accountAttrs = { name, description };
        const { errors, result, isValid } = newAccountValidator(accountAttrs);

        if (isValid) {
            const submitAction = await dispatch(postAccount(result));
            if (submitAction.success) {
                console.log(`Account ${result.name} created.`)
                props.history.push('/accounts');
            }
            else {
                setNewAccountError(submitAction.error)
            }
        }
        else {
            dispatch(setErrors(errors));
        }
    }

    const formFields = [
        {name: "Name", value: name, onChange:updateName, id: "name", errors: errors.name},
        {name: "Description", value: description, onChange:updateDescription, id: "description", errors: errors.description}
    ];

    return (
        <Fragment>
            <div className="new-account-page-container">
                <Form formHeader="New Account" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Submit"} 
                      formErrors={newAccountError}/>
            </div>
        </Fragment>
    );
};

export default CreateAccount;
