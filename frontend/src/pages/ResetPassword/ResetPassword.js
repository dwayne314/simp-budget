import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ResetPassword.css';
import Form from '../../components/Form/Form';
import { resetPassword, setErrors } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { resetPasswordEmailValidator } from '../../utilities';


export const ResetPassword = (props) => {
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const [password, setPassword] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState('');

    const updatePassword = evt => setPassword(evt.target.value);

    // Clear errors and then attempt to register
    const submitForm = async (e) => {
        e.preventDefault();
        setFormErrors('');        
        dispatch(setErrors({}));

        const userAttrs = {
            password
        };

        const {errors, result, isValid } = resetPasswordEmailValidator(userAttrs);

        if (isValid) {
            const submitAction = await dispatch(resetPassword(result));
            if (submitAction.success) setSubmitted(true);
            else setFormErrors(submitAction.error)
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
        {name: "Password", value: password, onChange:updatePassword, id: "password", errors: errors.password, inputType:'password'}
    ];

    return (
        <Fragment>
            <div className="reset-password-page-container">
                <Form formHeader="Reset Password"
                      formErrors={formErrors}
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Reset Password"}
                      bottomText={{introText: "Remember your password? ", linkText: "Login Here", linkTo:"/login"}}/>
            </div>
        </Fragment>
    );
};


export default ResetPassword;
