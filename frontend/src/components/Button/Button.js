import React from 'react';
import './Button.css';


const Button = (props) => {
    const { cta } = props;
    return (
        <div className="button-container">
            <div className="button-text">{cta}</div>
        </div>
    );
};


export default Button;
