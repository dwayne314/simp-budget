import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Register.css';
import Form from '../../components/Form/Form';
import { postRegister, setErrors } from '../../redux/actions';
import { getErrors } from '../../redux/selectors';
import { registrationValidator } from '../../utilities';


const Register = (props) => {
    const dispatch = useDispatch();
    const errors = useSelector(getErrors);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);

    const updateFirstName = evt => setFirstName(evt.target.value);
    const updateLastName = evt => setLastName(evt.target.value);
    const updateEmail = evt => setEmail(evt.target.value);
    const updatePassword = evt => setPassword(evt.target.value);

    // Clear errors and then attempt to register
    const submitForm = async (e) => {
        e.preventDefault();
        dispatch(setErrors({}));

        const userAttrs = {
            first_name: firstName,
            last_name: lastName,
            email,
            password
        };

        const {errors, result, isValid } = registrationValidator(userAttrs);

        if (isValid) {
            const submitAction = await dispatch(postRegister(result));
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
        {name: "First Name", value: firstName, onChange:updateFirstName, id: "firstName", errors: errors.first_name},
        {name: "Last Name", value: lastName, onChange:updateLastName, id: "lastName", errors: errors.last_name},
        {name: "Email", value: email, onChange:updateEmail, id: "email", errors: errors.email},        
        {name: "Password", value: password, onChange:updatePassword, id: "password", errors: errors.password, inputType:'password'}
    ];

    return (
        <Fragment>
            <div className="register-page-container">
                <Form formHeader="Register" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Register Here"}
                      bottomText={{introText: "Already have an account? ", linkText: "Login Here", linkTo:"/login"}}/>
            </div>
        </Fragment>
    );
};

export default Register;
