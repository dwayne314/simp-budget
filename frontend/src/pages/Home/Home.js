import React from 'react';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/Button/Button';
import './Home.css';


const Home = () => {
    return (
        <div className="home-container">
            <div className="home-sub-container">
                <Logo isPrimary={true} />
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
                        <Button isPrimary={true} cta={"Start Saving"}/>

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
    );
};

export default Home;
