import React from 'react';
import rightArrow from '../../static/icons/right-arrow.svg';
import leftArrow from '../../static/icons/left-arrow.svg';
import './Paginator.css';


const Paginator = (props) => {
    const { pageCount, currentPage, decrementPage, incrementPage } = props;
    return (
        <div className="paginator-container">
            <div className="paginator-info">{`Page ${pageCount ? currentPage : 0} of ${pageCount}`}</div>
            <div className="paginator-action-containers">
                <div onClick={decrementPage} className="paginator-last-page-container">
                    <img src={leftArrow} alt="left-arrow"></img>
                    <span>Last Page</span>
                </div>
                <div onClick={incrementPage} className="paginator-next-page-container">
                    <span>Next Page</span>
                    <img src={rightArrow} alt="right-arrow"></img>
                </div>
            </div>
        </div>
    )
};


export default Paginator;
