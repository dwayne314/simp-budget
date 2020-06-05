import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './CreateAccount.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
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

    return (
        <Fragment>
            <Header isPrimary={true} formHeader={true}/>        
            <div className="new-account-container">
                <div className="new-account-form-container">
                    <div className="new-account-form-header">
                        New Account
                    </div>
                  {newAccountError ? 
                        <div className="new-account-errors-container">
                            <div className="new-account-errors">{`${newAccountError}`}</div>
                        </div>
                        :
                        ""
                    }                
                    <div className="new-account-form">
                        
                        <form>
                            <div className="form-item-container">
                                <div className="form-label">
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className="form-input">
                                    <input onChange={updateName} type="text" id="name" value={name}/>
                                </div>
                                {(errors.name) ? <span className="new-account-error">{`* ${errors.name}`}</span> : ""}                            
                            </div>
                            <div className="form-item-container">
                                <div className="form-label">
                                    <label htmlFor="description">Description</label>
                                </div>
                                <div className="form-input">
                                    <input onChange={updateDescription} type="text" id="description" value={description}/>
                                </div>
                                {(errors.description) ? <span className="new-account-error">{`* ${errors.description}`}</span> : ""}                                                        
                            </div>
                            <div className="form-item-container form-button-container">
                                <Button onClick={submitForm} cta={"Submit"} isPrimary={false}/>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </Fragment>
    );
};

export default CreateAccount;
