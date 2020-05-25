import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';


const Button = (props) => {
    const { cta, isPrimary=false, linkPath=null, data={}, isDelete=false, isDulledPrimary=false, isDulledDelete=false } = props;
    const btn = <div onClick={props.onClick} className={`button-container${!isPrimary ? ' button-primary' : ' button-secondary'}${isDelete ? ' button-delete' : ''}${isDulledPrimary ? ' dulled-primary' : ''}${isDulledDelete ? ' dulled-delete' : ''}`}>
                    <div className="button-text">{cta}</div>
                </div>
    return (
        linkPath ? 
            <Fragment>
                 <Link to={{pathname: linkPath, data}}>{btn}</Link>
            </Fragment>
            :
            <Fragment>
                 {btn}
            </Fragment>
    );
};


export default Button;
