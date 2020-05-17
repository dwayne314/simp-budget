import React from 'react';
import './Button.css';


const Button = (props) => {
    const { cta, isPrimary=false } = props;
    return (
        <div className={`button-container${!isPrimary ? ' button-primary' : ' button-secondary'}`}>
            <div className="button-text">{cta}</div>
        </div>
    );
};


export default Button;
