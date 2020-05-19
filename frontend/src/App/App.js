import React from 'react';
import { Route } from 'react-router-dom';
import FlashMessage from '../components/FlashMessage/FlashMessage';

import {
    Home, 
    Login,
    Register,
    Accounts,
    CreateAccount,
    ViewAccount,
    EditAccount,
    CreateTransaction,
    EditTransaction
} from '../pages';
import './App.css';


const App = () => {
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
            <Route exact path="/accounts/:id/transactions/create" component={CreateTransaction}></Route>                
            <Route exact path="/accounts/:id/transactions/:transactionId/edit" component={EditTransaction}></Route>
        </div>
    );
};

export default App;
