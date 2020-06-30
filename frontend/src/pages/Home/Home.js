import React, { Fragment } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import TrackSpendingIcon from '../../static/icons/track-spending.svg';
import GenerateReportIcon from '../../static/icons/report.svg';
import LimitSpendingIcon from '../../static/icons/limit-spending.svg';
import GrowMoney from '../../static/icons/money-grow.svg';
import Goal from '../../static/icons/goal.svg';
import Relax from '../../static/icons/relax.svg';
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
                            <Button isPrimary={true} cta={"Get Started Today"} linkPath="/login"/>
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
            <div href="page"className="home-page-two-container">
                <div className="home-page">
                    <div className="home-page-header-container">
                        How It Works
                    </div>
                    <div className="how-it-works-container">
                        <div className="how-it-works">
                            <div className="how-it-works-icon">
                                <img src={TrackSpendingIcon} alt="a receipt"/>
                            </div>
                            <div className="how-it-works-header">Enter Your Transactions</div>                            
                            <div className="how-it-works-body">With our easy to use transaction logging interface, inserting new account transactions is effortless.</div>
                        </div>
                        <div className="how-it-works">
                            <div className="how-it-works-icon">
                                <img src={LimitSpendingIcon} alt="scissors cutting a coupon"/>
                            </div>
                            <div className="how-it-works-header">Set Spending Limits</div>                            
                            <div className="how-it-works-body">Easily set up spending limits on user, account, or transaction levels that allows you to take full control of your spending.</div>
                        </div>
                        <div className="how-it-works">
                            <div className="how-it-works-icon">
                                <img src={GenerateReportIcon} alt="a report"/>
                            </div>
                            <div className="how-it-works-header">Generate Reports</div>                            
                            <div className="how-it-works-body">Budget reporting has never been easier with custom account health exports sent to you at daily, weekly, or monthly intervals.</div>
                        </div>
                    </div>
                    <div className="home-button">
                        <Button isPrimary={true} cta={"Start Saving Now"} linkPath="/login"/>
                    </div>
                </div>
            </div>
             <div href="page"className="home-page-three-container">
                    <div className="home-page">
                        <div className="home-page-header-container">
                            Why SimpBudget
                        </div>
                        <div className="how-it-works-container">
                            <div className="how-it-works">
                                <div className="how-it-works-icon">
                                    <img src={GrowMoney} alt="money growing on a plany"/>
                                </div>
                                <div className="how-it-works-header">Watch Your Money Grow</div>                            
                                <div className="how-it-works-body">SimpBudget helps you save by bringing awareness to the things that are costing you the most.</div>
                            </div>
                            <div className="how-it-works">
                                <div className="how-it-works-icon" alt="a success graph with an exteended flag">
                                    <img src={Goal} alt="a success graph with a flag coming from the highest point"/>
                                </div>
                                <div className="how-it-works-header">Improve Your Goal Setting</div>                            
                                <div className="how-it-works-body">SimpBudget makes it easy to set financial goals and is with you the whole way on your path to acheive them.</div>
                            </div>
                            <div className="how-it-works">
                                <div className="how-it-works-icon">
                                    <img src={Relax} alt="a man relaxing around money"/>
                                </div>
                                <div className="how-it-works-header">Take Financial Control</div>                            
                                <div className="how-it-works-body">With SimpBudget, you will finally be able to take control of your finances and live the life you always wanted.</div>
                            </div>
                        </div>
                        <div className="home-button">
                            <Button isPrimary={true} cta={"Take Control Now"} linkPath="/login"/>
                        </div>
                    </div>
                </div>
        </Fragment>
    );
};

export default Home;
