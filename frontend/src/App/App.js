import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { useLocation } from 'react-router';
import { setErrors } from '../redux/actions';
import FlashMessage from '../components/FlashMessage/FlashMessage';
import {
    Home, 
    Login,
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
    useEffect(() => {
        dispatch(setErrors({}));
    }, [location.pathname, dispatch]);

    return (
        <div className='app-container'>
            <FlashMessage />
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/login" component={Login}></Route>
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
    );
};

export default App;
