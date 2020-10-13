import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { setErrors, getToken, toggleMobileDisplay, toggleSettingsDrawer } from '../redux/actions';
import { getAuthTokenExpiration, getCurrentUser, isSettingsDrawerOpen, isMobileDisplay } from '../redux/selectors';
import { isEmpty, isProtectedRoute, useCurrentWidth } from '../utilities';
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
    ViewTransaction,
    EditTransaction,
    DeleteTransactions,
    ViewRecurringTransaction,
    EditRecurringTransaction,
    DeleteRecurringTransactions,
    SendPasswordReset,
    PageNotFound,
    VerifyEmail,
    ResetPassword
} from '../pages';
import './App.css';


const App = (props) => {
    const dispatch = useDispatch();
    const authTokenExpiration = useSelector(getAuthTokenExpiration);
    const currentUser = useSelector(getCurrentUser);
    const isSettingsOpen = useSelector(isSettingsDrawerOpen);
    const isMobile = useSelector(isMobileDisplay);
    const windowWidth = useCurrentWidth();
    const mobileDisplayIndicator = windowWidth > 600;
    const expiresIn5Minutes = authTokenExpiration - (new Date().getTime() + 60000 * 5);

    // Clear errors and close settings on every page update
    useEffect(() => {
        dispatch(setErrors({}));
        dispatch(toggleSettingsDrawer(false));
        
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

    useEffect(() => {
        if (mobileDisplayIndicator) dispatch(toggleMobileDisplay(false));
        else dispatch(toggleMobileDisplay(true));

    }, [mobileDisplayIndicator, dispatch]);

    return (
        <div className='app-container'>
            <FlashMessage />
            <Header isPrimary={true} />
            <div className={`app-sub-container${isMobile && isSettingsOpen ? ' hidden' : ''}`}>
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
                    <Route exact path="/accounts/:id/transactions/:transactionId/view" component={ViewTransaction}></Route>
                    <Route exact path="/accounts/:id/transactions/:transactionId/edit" component={EditTransaction}></Route>
                    <Route exact path="/accounts/:id/transactions/delete" component={DeleteTransactions}></Route>
                    <Route exact path="/accounts/:id/transactions/:transactionId/delete" component={DeleteTransactions}></Route>
                    <Route exact path="/accounts/:id/recurringTransactions/:recurringTransactionId/view" component={ViewRecurringTransaction}></Route>
                    <Route exact path="/accounts/:id/recurringTransactions/:recurringTransactionId/edit" component={EditRecurringTransaction}></Route>
                    <Route exact path="/accounts/:id/recurringTransactions/:recurringTransactionId/delete" component={DeleteRecurringTransactions}></Route>
                    <Route exact path="/sendPasswordReset" component={SendPasswordReset} />

                    {/* Email Source Routes */}
                    <Route exact path="/verifyEmail" component={VerifyEmail} />
                    <Route exact path="/resetPassword" component={ResetPassword} />
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </div>
        </div>
    );
};

export default withRouter(App);
