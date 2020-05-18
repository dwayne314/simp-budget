import React from 'react';
import './EditTransaction.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const EditTransaction = () => {
    return (
        <div className="edit-transaction-container">

            <div className="edit-transaction-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="edit-transaction-form-container">
                <div className="edit-transaction-form-header">
                    Edit Transaction
                </div>
                <div className="edit-transaction-form">
                    
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

export default EditTransaction;
