import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { postLogin, setErrors, setCsrfToken } from '../../redux/actions';
import { currentUserId, getAccounts, getErrors } from '../../redux/selectors';
import { loginValidator } from '../../utilities';


const Login = (props) => {

    const dispatch = useDispatch();
    const currentUser = useSelector(currentUserId);
    const errors = useSelector(getErrors);
    const accounts = useSelector(getAccounts);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErrors, setLoginErrors] = useState('');

    const updateEmail = evt => setEmail(evt.target.value);
    const updatePassword = evt => setPassword(evt.target.value);

    // Clear errors and then attempt to login
    const submitForm = async (e) => {
        e.preventDefault();
        setLoginErrors('');
        dispatch(setErrors({}));

        const userAttrs = { email, password };
        const { errors, result, isValid } = loginValidator(userAttrs);

        if (isValid) {
            const submitAction = await dispatch(postLogin(result));
            if (!submitAction.success) setLoginErrors(submitAction.error);
        }
        else {
            dispatch(setErrors(errors));
        }
    };
  
    useEffect(() => {
        if (currentUser) {
            props.history.push(`/accounts`);
        }

    }, [props.history, currentUser, accounts]);

    useEffect(() => {
        const csrfToken = Cookies.get('csrf_token')
        setCsrfToken(csrfToken)
    }, [])

    return (
        <Fragment>
            <Header isPrimary={true} formHeader={true}/>
            <div className="login-container">
                <div className="login-form-container">
                    <div className="login-form-header">
                        Login
                    </div>
                    {loginErrors ? 
                        <div className="login-errors-container">
                            <div className="login-errors">{`${loginErrors}`}</div>
                        </div>
                        :
                        ""
                    }
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
        </Fragment>
    );
};

export default Login;
