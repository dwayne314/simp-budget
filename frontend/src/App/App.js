import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { useLocation } from 'react-router';
import { setErrors, getToken } from '../redux/actions';
import { getAuthTokenExpiration, getCurrentUser } from '../redux/selectors';
import { isEmpty } from '../utilities';
import FlashMessage from '../components/FlashMessage/FlashMessage';
import {
    Home, 
    Login,
    Logout,
    Register,
    Accounts,
    CreateAccount,
    ViewAccount,
    EditAccount,
    DeleteAccount,
    CreateTransaction,
    EditTransaction,
    DeleteTransactions
} from '../pages';
import './App.css';


const App = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const authTokenExpiration = useSelector(getAuthTokenExpiration);
    const currentUser = useSelector(getCurrentUser);
    const expiresIn5Minutes = authTokenExpiration - (new Date().getTime() + 60000 * 5);

    useEffect(() => {
        // Clear errors on every page update
        dispatch(setErrors({}));
        
    }, [location.pathname, dispatch]);

    // Fetch a new token if the current one expires in 5 minutes
    useEffect(() => {
        if (!isEmpty(currentUser)) {
            if (!expiresIn5Minutes > 0) {
                dispatch(getToken());
            }
        }
        
    }, [location.pathname, dispatch, expiresIn5Minutes, currentUser]);

    return (
        <div className='app-container'>
            <div className="app-sub-container">
                <FlashMessage />
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/logout" component={Logout}></Route>
                <Route exact path="/register" component={Register}></Route>
                <Route exact path="/accounts" component={Accounts}></Route>
                <Route exact path="/accounts/create" component={CreateAccount}></Route>
                <Route exact path="/accounts/:id/view" component={ViewAccount}></Route>
                <Route exact path="/accounts/:id/edit" component={EditAccount}></Route>
                <Route exact path="/accounts/:id/delete" component={DeleteAccount}></Route>
                <Route exact path="/accounts/:id/transactions/create" component={CreateTransaction}></Route>                
                <Route exact path="/accounts/:id/transactions/:transactionId/edit" component={EditTransaction}></Route>
                <Route exact path="/accounts/:id/transactions/delete" component={DeleteTransactions}></Route>
            </div>
        </div>
    );
};

export default App;
