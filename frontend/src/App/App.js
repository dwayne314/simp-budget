import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from '../redux/store';

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
        <BrowserRouter>
            <Provider store={store}>
                <div className='app-container'>
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
            </Provider>
        </BrowserRouter>
    );
};

export default App;
