import React from 'react';
import rightArrow from '../../static/icons/right-arrow.svg';
import disabledRightArrow from '../../static/icons/right-arrow-disabled.svg';
import leftArrow from '../../static/icons/left-arrow.svg';
import disabledLeftArrow from '../../static/icons/left-arrow-disabled.svg';
import './Paginator.css';


const Paginator = (props) => {
    const { pageCount, currentPage, decrementPage, incrementPage } = props;

    return (
        <div className="paginator-container">
            <div className="paginator-action-containers">
                <div onClick={decrementPage} className={`paginator-action-container${currentPage > 1 ? '' : ' paginator-disabled-icon'}`}>
                    <img src={currentPage > 1 ? leftArrow : disabledLeftArrow} alt="left-arrow"></img>
                </div>
                <div className="paginator-info">{`Page ${pageCount ? currentPage : 0} of ${pageCount}`}</div>

                <div onClick={incrementPage} className={`paginator-action-container${currentPage !== pageCount ? '' : ' paginator-disabled-icon'}`}>
                    <img src={currentPage !== pageCount ? rightArrow : disabledRightArrow} alt="right-arrow"></img>
                </div>
            </div>
        </div>
    )
};


export default Paginator;
