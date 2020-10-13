import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { isMobileDisplay } from '../../redux/selectors';
import { toggleSettingsDrawer } from '../../redux/actions';

import './Settings.css';


const Settings = (props) => {
    const isMobile = useSelector(isMobileDisplay);
    const dispatch = useDispatch();
    const settingsContainer = useRef(null);
    
    const redirect = (redirectTo) => {
        if (redirectTo === 'login') {
            props.history.push('/login');
        }
        else if (redirectTo === 'logout') {
            props.history.push('/logout');
        }
    };

    const settingsOptions = [
        { title: 'My Account', disabled: true, action: () => null},
        { title: 'Data', disabled: true, action: () => null},
        { title: 'Budget', disabled: true, action: () => null},
        { title: 'Logout', disabled: false, action: () => redirect('logout')},
    ];


    const settingsDrawer = settingsOptions.map((setting, index) => {
        return (
            <div key={index} onClick={() => setting.action()} className={`${!setting.disabled ? 'settings-drawer-section' : 'settings-drawer-section-disabled'}${!isMobile ? ' settings-drawer-section-large-screen' : ''}`}>
                <div className={`settings-drawer-label${!isMobile ? ' settings-drawer-label-large-screen' : ''}`}>{setting.title}</div>
            </div>
        );
    });

    // Close the settings drawer if an click is made outside of the container
    useEffect(() => {
        const handleSettingsClick = (evt) => {
            if (settingsContainer.current && !settingsContainer.current.contains(evt.target)) {
                dispatch(toggleSettingsDrawer(false));    
            }
        };
        document.addEventListener('click', handleSettingsClick);

        return () => document.removeEventListener('click', handleSettingsClick);
    });

    return (
        <div ref={settingsContainer} className={`settings-container${!isMobile ? ' settings-container-large-screen' : ''}`}>
            <div className="settings-drawer-sections">
                {settingsDrawer}
            </div>
        </div>
    );
};

export default withRouter(Settings);
