import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';


const Button = (props) => {
    const { cta, isPrimary=false, linkPath=null } = props;
    const btn = <div className={`button-container${!isPrimary ? ' button-primary' : ' button-secondary'}`}>
                    <div className="button-text">{cta}</div>
                </div>
    return (
        linkPath ? 
            <Fragment>
                 <Link to={linkPath}>{btn}</Link>
            </Fragment>
            :
            <Fragment>
                 {btn}
            </Fragment>
    );
};


export default Button;
