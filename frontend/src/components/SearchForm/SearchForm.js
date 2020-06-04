import React from 'react';
import './SearchForm.css';


const SearchForm = (props) => {
    const { onChange, searchText, placeholder='' } = props;

    const submiSearchForm = (e) => {
        e.preventDefault();
    };

    return (
            <div className="view-account-search-form-container">
                <div>
                    <div className="search-form">
                        <form onSubmit={submiSearchForm}>
                            <input onChange={onChange} type="text" placeholder={placeholder} value={searchText}></input>
                        </form>
                    </div>
                </div>
            </div>
    );
};

export default SearchForm;
