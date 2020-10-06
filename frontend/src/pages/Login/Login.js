import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import './Login.css';
import Form from '../../components/Form/Form';
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
    const [formErrors, setFormErrors] = useState('');

    const updateEmail = evt => setEmail(evt.target.value);
    const updatePassword = evt => setPassword(evt.target.value);
    const clearForm = () => {
        setEmail('');
        setPassword('');
    };

    // Clear errors and then attempt to login
    const submitForm = async (e) => {
        e.preventDefault();
        setFormErrors('');
        dispatch(setErrors({}));

        // Stores the form attributes before clearing the form
        const userAttrs = { email, password };
        clearForm();
        const { errors, result, isValid } = loginValidator(userAttrs);


        if (isValid) {
            const submitAction = await dispatch(postLogin(result));
            if (!submitAction.success) setFormErrors(submitAction.error);
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

    const formFields = [
        {name: "Email", value: email, onChange:updateEmail, id: "email", errors: errors.email},
        {name: "Password", value: password, onChange:updatePassword, id: "password", errors: errors.password, inputType:'password', additionalText:{cta: 'Forgot Password?', linkTo: '/sendPasswordReset'}}
    ];

    return (
        <Fragment>
            <div className="login-page-container">
                <Form formHeader="Login" 
                      fields={formFields} 
                      submit={submitForm} 
                      submitCTA={"Login Here"}
                      formErrors={formErrors}
                      bottomText={{introText: "Don't have an account? ", linkText: "Register Here", linkTo:"/register"}}/>

            </div>
        </Fragment>
    );
};

export default Login;
