import React from 'react';
import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PrimaryLogo from '../../static/icons/logo-primary.svg';
import SecondaryLogo from '../../static/icons/logo-secondary.svg';
import { getCurrentUser } from '../../redux/selectors';
import { isEmpty } from '../../utilities';
import './Header.css';


const Header = (props) => {
    const { isPrimary, formHeader=false } = props;
    const userLoggedIn = isEmpty(useSelector(getCurrentUser));


    const redirect = (redirectTo) => {
        if (redirectTo === 'goBack') {
            props.history.goBack();
        }
        else if (redirectTo === 'login') {
            props.history.push('/login');
        }
        else {
            props.history.push('/logout');
        }
    }
    
    const btnContent = () => {
        let headerNavBtn;
        if (formHeader) {
            headerNavBtn = (
                <div onClick={() => redirect('goBack')} className="login-button-container">
                    <div className="">Go Back</div>
                </div>
            )
        }
        else if (userLoggedIn) {
            headerNavBtn = (
                <div onClick={() => redirect('login')} className="login-button-container">
                    <div className="">Login</div>
                </div>
            )
        }
        else {
            headerNavBtn = (
                <div onClick={() => redirect('logout')} className="login-button-container">
                    <div className="">Log Out</div>
                </div>
            )
        }
        return (
            headerNavBtn
        )
    }

    return (
            <div className="header-container">
                <div className="header-sub-container">
                    <div className="home-button-container">
                        <Link to="/">
                            <img src={isPrimary ? PrimaryLogo : SecondaryLogo} alt="we-budget logo"></img>
                        </Link>
                    </div>
                    {btnContent()}
                </div>
            </div>
    );
};

export default withRouter(Header);
