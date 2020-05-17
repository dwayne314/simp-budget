import React from 'react';
import PrimaryLogo from '../../static/icons/logo-primary.svg';
import SecondaryLogo from '../../static/icons/logo-secondary.svg';
import './Logo.css'

const Logo = (props) => {
    const { isPrimary } = props;

    return (
        <div className="logo-container">
            <img src={isPrimary ? PrimaryLogo : SecondaryLogo} alt="we-budget logo"></img>
        </div>
    );
};

export default Logo;
