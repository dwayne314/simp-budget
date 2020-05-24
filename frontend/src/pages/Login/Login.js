import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Login.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import { fetchLogin, setErrors } from '../../redux/actions';
import { currentUserId, getAccounts, getErrors } from '../../redux/selectors';
import { loginValidator } from '../../utilities';


const Login = (props) => {

    const dispatch = useDispatch();
    const currentUser = useSelector(currentUserId);
    const errors = useSelector(getErrors);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const accounts = useSelector(getAccounts)

    const updateEmail = evt => {
        setEmail(evt.target.value)
    }

    const updatePassword = evt => {
        setPassword(evt.target.value)
    }

    const submitForm = () => {
        const userAttrs = { email, password }

        const {errors, result, isValid } = loginValidator(userAttrs);

        if (isValid) {
            dispatch(fetchLogin(result));
        }
        else {
            dispatch(setErrors(errors));
        }
    };
  
    useEffect(() => {
        if (currentUser) {
            props.history.push(`/accounts`)
        }

    }, [ props.history, currentUser, accounts])

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
                                <input onChange={updateEmail} type="text" value={email}/>
                            </div>
                            {(errors.email) ? <span className="login-error">{`* ${errors.email}`}</span> : ""}

                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Password</label>
                            </div>
                            <div className="form-input">
                                <input onChange={updatePassword} type="password" value={password}/>
                            </div>
                            {(errors.password) ? <span className="login-error">{`* ${errors.password}`}</span> : ""}                            
                        </div>
                        <div className="form-item-container form-button-container">
                            <Button onClick={submitForm} cta={"Login Here"} isPrimary={false}/>
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
