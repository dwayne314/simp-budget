import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryLogo from '../../static/icons/logo-primary.svg';
import SecondaryLogo from '../../static/icons/logo-secondary.svg';
import './Logo.css'


const Logo = (props) => {
    const { isPrimary } = props;

    return (
        <div className="logo-container">
            <Link to="/">
                <img src={isPrimary ? PrimaryLogo : SecondaryLogo} alt="we-budget logo"></img>
            </Link>
        </div>
    );
};

export default Logo;
