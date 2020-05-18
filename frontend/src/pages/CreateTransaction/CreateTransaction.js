import React from 'react';
import './CreateTransaction.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const CreateTransaction = () => {
    return (
        <div className="new-transaction-container">

            <div className="new-transaction-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="new-transaction-form-container">
                <div className="new-transaction-form-header">
                    New Transaction
                </div>
                <div className="new-transaction-form">
                    
                    <form>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="amount">Amount</label>
                            </div>
                            <div className="form-input">
                                <input type="text" id="amount"/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="note">Note</label>
                            </div>
                            <div className="form-input">
                                <input type="text" id="note"/>
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

export default CreateTransaction;
