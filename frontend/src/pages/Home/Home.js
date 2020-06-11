import React, { Fragment } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import TrackSpendingIcon from '../../static/icons/track-spending.svg';
import GenerateReportIcon from '../../static/icons/report.svg';
import LimitSpendingIcon from '../../static/icons/limit-spending.svg';
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
            <div href="page"className="home-page-2-container">
                <div className="home-page-two">
                    <div className="page-two-header-container">
                        How It Works
                    </div>
                    <div className="how-it-works-container">
                        <div className="how-it-works">
                            <div className="how-it-works-icon">
                                <img src={TrackSpendingIcon} alt="a picture of a receipt"/>
                            </div>
                            <div className="how-it-works-header">Enter Your Transactions</div>                            
                            <div className="how-it-works-body">With our easy to use transaction logging interface, inserting new account transactions is effortless.</div>
                        </div>
                        <div className="how-it-works">
                            <div className="how-it-works-icon" alt="scissors cutting a coupon">
                                <img src={LimitSpendingIcon}/>
                            </div>
                            <div className="how-it-works-header">Set Spending Limits</div>                            
                            <div className="how-it-works-body">Easily set up spending limits on user, account, or transaction levels that allows you to take full control of your spending.</div>
                        </div>
                        <div className="how-it-works">
                            <div className="how-it-works-icon">
                                <img src={GenerateReportIcon} alt="a picture of a report"/>
                            </div>
                            <div className="how-it-works-header">Generate Reports</div>                            
                            <div className="how-it-works-body">Budget reporting has never been easier with custom account health exports sent to you at daily, weekly, or monthly intervals.</div>
                        </div>
                    </div>
                    <div className="home-button">
                        <Button isPrimary={true} cta={"Start Saving"} linkPath="/login"/>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Home;
