import React from 'react';
import PrimaryLogo from '../../static/icons/logo-primary.svg';
import './Logo.css'

const Logo = () => {
    return (
        <div className="logo-container">
            <img src={PrimaryLogo} alt="we-budget logo"></img>
        </div>
    );
};

export default Logo;
