import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { setErrors, getToken } from '../redux/actions';
import { getAuthTokenExpiration, getCurrentUser } from '../redux/selectors';
import { isEmpty, isProtectedRoute } from '../utilities';
import FlashMessage from '../components/FlashMessage/FlashMessage';
import Header from '../components/Header/Header';
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
    DeleteTransactions,
    EditRecurringTransaction,
    DeleteRecurringTransactions,
    PageNotFound
} from '../pages';
import './App.css';


const App = (props) => {
    const [formHeader, setFormHeader] = useState(false);
    const dispatch = useDispatch();
    const authTokenExpiration = useSelector(getAuthTokenExpiration);
    const currentUser = useSelector(getCurrentUser);
    const expiresIn5Minutes = authTokenExpiration - (new Date().getTime() + 60000 * 5);

    useEffect(() => {
        // Clear errors on every page update
        dispatch(setErrors({}));
        
    }, [props.location.pathname, dispatch]);

    // Fetch a new token if the current one expires in 5 minutes
    useEffect(() => {
        if (!isEmpty(currentUser)) {
            if (!expiresIn5Minutes > 0) {
                dispatch(getToken());
            }
        }
        
    }, [props.location.pathname, dispatch, expiresIn5Minutes, currentUser]);

    // Redirect to login if the user is not logged in and accessing a protected route
    useEffect(() => {
        if (isProtectedRoute(props.location.pathname) && isEmpty(currentUser)) {
            props.history.push('/login');
        }
    }, [props.location.pathname, props.history, currentUser]);

    // Use the form header if the page is a form 
    useEffect(() => {
        // Update to the opposite so arror pages can get goBack
        const formRoutes = ['/create', '/edit', '/login', '/register'];
        const route = props.location.pathname;
        const routeAction = route.slice(route.lastIndexOf('/'), route.length);
        const isformRoute = formRoutes.indexOf(routeAction) !== -1;

        if (isformRoute) {
            setFormHeader(true);
        }
        else {
            setFormHeader(false);
        }
    }, [props.location.pathname])

    return (
        <div className='app-container'>
            <FlashMessage />
            <Header isPrimary={true} formHeader={formHeader}/>
            <div className="app-sub-container">
                <Switch>
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
                    <Route exact path="/accounts/:id/recurringTransactions/:recurringTransactionId/edit" component={EditRecurringTransaction}></Route>
                    <Route exact path="/accounts/:id/recurringTransactions/delete" component={DeleteRecurringTransactions}></Route>
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </div>
        </div>
    );
};

export default withRouter(App);
