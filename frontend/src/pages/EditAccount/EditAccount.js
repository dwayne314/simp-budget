import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './EditAccount.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { setErrors, patchAccount } from '../../redux/actions';
import { getErrors, getAccountById } from '../../redux/selectors';
import { newAccountValidator } from '../../utilities';


const EditAccount = (props) => {
    const { id:accountId } = props.match.params;
    const currentAccount = useSelector(state => getAccountById(state)(Number(accountId)));

    const dispatch = useDispatch();

    const errors = useSelector(getErrors);
    const [name, setName] = useState(currentAccount.name);
    const [description, setDescription] = useState(currentAccount.description);
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

    return (
        <Fragment>
            <Header isPrimary={true} formHeader={true}/>                
            <div className="edit-account-container">
                <div className="edit-account-form-container">
                    <div className="edit-account-form-header">
                        Edit Account
                    </div>
                    {editAccountErrors ? 
                        <div className="login-errors-container">
                            <div className="login-errors">{`${editAccountErrors}`}</div>
                        </div>
                        :
                        ""
                    }                
                    <div className="edit-account-form">
                        
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

export default EditAccount;
