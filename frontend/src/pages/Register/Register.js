import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Register.css';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import { fetchRegister } from '../../redux/actions';


const Register = (props) => {

    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const updateFirstName = evt => {
        setFirstName(evt.target.value)
    }

    const updateLastName = evt => {
        setLastName(evt.target.value)
    }

    const updateEmail = evt => {
        setEmail(evt.target.value)
    }

    const updatePassword = evt => {
        setPassword(evt.target.value)
    }
   
    const submitForm = () => {
        dispatch(fetchRegister({
            first_name: firstName,
            last_name: lastName,
            email,
            password
        }));
        props.history.push('/login');
    };    

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
                                <input onChange={updateFirstName} type="text" value={firstName}/>
                            </div>

                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Last Name</label>
                            </div>
                            <div className="form-input">
                                <input onChange={updateLastName} type="text" value={lastName}/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Email</label>
                            </div>
                            <div className="form-input">
                                <input onChange={updateEmail} type="text" value={email}/>
                            </div>
                        </div>
                        <div className="form-item-container">
                            <div className="form-label">
                                <label htmlFor="last-name">Password</label>
                            </div>
                            <div className="form-input">
                                <input onChange={updatePassword} type="password" value={password}/>
                            </div>
                        </div>
                        <div className="form-item-container form-button-container">
                            <Button onClick={submitForm} cta={"Register Here"} isPrimary={false}/>
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
