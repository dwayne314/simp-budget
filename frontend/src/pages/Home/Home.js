import React, { Fragment } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './Home.css';


const Home = () => {
    return (
        <Fragment>
            <div className="home-page-one-container">
                <div className="home-page-one">
                    <div className="home-logo-container">
                        <Header isPrimary={true} />
                    </div>
                    <div className="home-center-container">
                        <div className="home-text-container">
                            <div className="home-text-header">
                                Budget With Us
                            </div>
                            <div className="home-text-subheader">
                                Track your spending with us. Your pockets will love you.
                            </div>
                        </div>
                        <div className="home-button">
                            <Button isPrimary={true} cta={"Start Saving"} linkPath="/login"/>

                        </div>

                    </div>
                    <div className="home-footer-container">
                        <div className="">
                            <div className="">Learn Move</div>
                       </div>
                       <div className="home-triangle-container">
                            <div className="home-triangle"></div>
                       </div>
                       
                    </div>                
                </div>
            </div>
            <div className="home-page-2-container">page 3</div>
        </Fragment>
    );
};

export default Home;
