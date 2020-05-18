import React from 'react';
import './EditAccount.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const EditAccount = () => {
    return (
        <div className="edit-account-container">

            <div className="edit-account-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="edit-account-form-container">
                <div className="edit-account-form-header">
                    Edit Account
                </div>
                <div className="edit-account-form">
                    
                    <form>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="form-input">
                                <input type="text" id="name"/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="description">Description</label>
                            </div>
                            <div className="form-input">
                                <input type="text" id="description"/>
                            </div>
                        </div>
                        <div className="form-item-container form-button-container">
                            <Button cta={"Submit"} isPrimary={false}/>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default EditAccount;
