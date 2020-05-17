import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';


const Login = () => {
    return (
        <div className="login-container">

            <div className="login-logo-container">
                <Logo isPrimary={false}/>
            </div>
            <div className="login-form-container">
                <div className="login-form-header">
                    Login
                </div>
                <div className="login-form">
                    
                    <form>
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
                            <Button cta={"Login Here"} isPrimary={false}/>
                        </div>
                    </form>
                </div>
                <div className="form-bottom-text-container">
                    <div className="form-bottom-text">
                        Don't have an account? <Link to="/register">Register Here</Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Login;
