import React, { Fragment } from 'react';
import './ToggleSwitch.css';


const ToggleSwitch = (props) => {
    const { id, isToggled, handleToggle } = props;

    return (
        <Fragment>
            <input className="toggle-switch-checkbox" 
                   id={id} 
                   type="checkbox"
                   checked={isToggled}
                   onChange={handleToggle}
            />
            <label className={`toggle-switch-label ${isToggled ? ' toggle-switch-label-active' : ''}`} htmlFor={id}>
                <span className="toggle-switch-button" />
            </label>
        </Fragment>
    );
};


export default ToggleSwitch;
