import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SendPasswordReset.css';
import Form from '../../components/Form/Form';
import { sendPasswordResetEmail, setErrors } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { sendResetPasswordEmailValidator } from '../../utilities';

const SendPasswordReset = (props) => {

    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const [email, setEmail] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);

    const updateEmail = evt => setEmail(evt.target.value);

    
    const submitForm = async (e) => {
        e.preventDefault();
        dispatch(setErrors({}));

        const userAttrs = {
            email,
        };

        const {errors, result, isValid } = sendResetPasswordEmailValidator(userAttrs);

        if (isValid) {
            const submitAction = await dispatch(sendPasswordResetEmail(result));
            if (submitAction.success) setSubmitted(true);   
        }
        else {
            dispatch(setErrors(errors));
        }
    }; 

    useEffect(() => {
        if (!errors.length && isSubmitted) {
            props.history.push('/login');    
        }    
    }, [isSubmitted, errors.length, props.history]);

    const formFields = [
        {name: "Email", value: email, onChange:updateEmail, id: "email", errors: errors.email}
    ];

    return (
        <Fragment>
            <div className="send-password-reset-page-container">
                <Form formHeader="Reset Password" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Send Password Reset Email"}
                      bottomText={{introText: "Remember Your Password? ", linkText: "Login Here", linkTo:"/login"}}/>
            </div>
        </Fragment>
    );
}

export default SendPasswordReset;
