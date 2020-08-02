import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Icon.css';


const Icon = (props) => {
    const { type, alt, linkPath=null, unClickable=false, data={} } = props;
    const btn = <div onClick={props.onClick} className={`icon-container${unClickable ? ' un-clickable' : ''}`}>
                    <img src={type} alt={alt}></img>
                </div>

    return (
        linkPath && !unClickable ? 
            <Fragment>
                 <Link to={{pathname: `${typeof linkPath === 'string' ? linkPath : linkPath()}`, data}}>{btn}</Link>
            </Fragment>
            :
            <Fragment>
                 {btn}
            </Fragment>
    );
};


export default Icon;
