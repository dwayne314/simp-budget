import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const Register = () => {
    return (
        <div className="register-container">

            <div className="register-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="register-form-container">
                <div className="register-form-header">
                    Register
                </div>
                <div className="register-form">
                    
                    <form>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="first-name">First Name</label>
                            </div>
                            <div className="form-input">
                                <input type="text"/>
                            </div>

                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Last Name</label>
                            </div>
                            <div className="form-input">
                                <input type="text"/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Email</label>
                            </div>
                            <div className="form-input">
                                <input type="text"/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Password</label>
                            </div>
                            <div className="form-input">
                                <input type="password"/>
                            </div>
                        </div>
                        <div className="form-item-container form-button-container">
                            <Button cta={"Register Here"} isPrimary={false}/>
                        </div>
                    </form>
                </div>
                <div className="form-bottom-text-container">
                    <div className="form-bottom-text">
                        Already have an account? <Link to="/login">Login Here</Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Register;
