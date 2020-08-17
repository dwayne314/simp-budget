import React from 'react';
import Button from '../Button/Button';

import './SafeDelete.css'


const SafeDelete = (props) => {

    const { safeDelete, unsafeDelete } = props;

    const getMessage = (domain) => {
        if (domain === 'account') {
            return 'account and all of it\'s data';
        }
    };

    const confirmDelete = () => safeDelete()
    const denyDelete = () => unsafeDelete()


    return <div className="safe-delete-container">
                <div className="safe-delete-form-container">
                    <span>{`Are you sure you want to delete this ${getMessage(props.domain)}`}?</span> 
                    <div className="safe-delete-options">
                     
                        <Button onClick={denyDelete} isPrimary={false} cta='Go Back' />
                        <Button isDelete='true' onClick={confirmDelete} isPrimary={true} cta='Yes' />

                    </div>
                </div>
            </div>
};

export default SafeDelete;
