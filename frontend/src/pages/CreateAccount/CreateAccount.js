import React from 'react';
import './CreateAccount.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const CreateAccount = () => {
    return (
        <div className="new-account-container">

            <div className="new-account-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="new-account-form-container">
                <div className="new-account-form-header">
                    New Account
                </div>
                <div className="new-account-form">
                    
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

export default CreateAccount;
