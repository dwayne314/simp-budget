import React from 'react';
import Button from '../../components/Button/Button';
import './PageNotFound.css';


const PageNotFound = () => {
    return (
        <div className="error-page-container">
            <div className="error-code">404</div>
            <div className="error-code-header">Page not found</div>
            <div className="error-message">
                Sorry we could not find the page you were looging for.
                But don't worry, you can get back to saving by clicking the link below.
            </div>
            <div className="error-page-button-container">
                <Button isPrimary={true} cta={"Go To Accounts"} linkPath={`/accounts`}/>
            </div>
    </div>
    );
};


export default PageNotFound;
