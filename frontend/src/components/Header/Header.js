import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PrimaryLogo from '../../static/icons/logo-primary.svg';
import SecondaryLogo from '../../static/icons/logo-secondary.svg';
import Close from '../../static/icons/close.svg';
import Icon from '../../components/Icon/Icon';
import Settings from '../../components/Settings/Settings';
import { toggleSettingsDrawer } from '../../redux/actions';
import { getCurrentUser, isSettingsDrawerOpen } from '../../redux/selectors';
import { isEmpty } from '../../utilities';

import menuIcon from '../../static/icons/menu.svg';

import './Header.css';


const Header = (props) => {
    const { isPrimary } = props;
    const dispatch = useDispatch();
    const isSettingsOpen = useSelector(isSettingsDrawerOpen);
    const userLoggedIn = !isEmpty(useSelector(getCurrentUser));

    const toggleSettings = () => {
        dispatch(toggleSettingsDrawer(isSettingsOpen ? false : true));
    };
    
    const navMenu = () => {
        let headerNavBtn;

        if (userLoggedIn) {
            if (!isSettingsOpen) {
                headerNavBtn = (
                   <div className="settings-icon">
                        <Icon
                            type={menuIcon} 
                            alt="hamburger-icon"
                            onClick={toggleSettings}
                        />
                    </div>
                );
            }
            else {
                headerNavBtn = (
                   <Fragment>
                       <div className="settings-icon">
                            <Icon
                                type={Close} 
                                alt="X-icon"
                                onClick={toggleSettings}
                            />
                        </div>
                        <Settings/>
                    </Fragment>
                );
            }
        }
        else {
            headerNavBtn = (
                <div onClick={() => props.history.push('/login')} className="login-button-container">
                    <div className="">Login</div>
                </div>
            );
        }
        return (
            headerNavBtn
        );
    }

    return (
        <div className="header-container">
            <div className="header-sub-container">
                <div className="home-button-container">
                    <Link to={userLoggedIn ? "/accounts" : "/"}>
                        <img src={isPrimary ? PrimaryLogo : SecondaryLogo} alt="we-budget logo"></img>
                    </Link>
                </div>
                {navMenu()}
            </div>
        </div>
    );
};

export default withRouter(Header);
