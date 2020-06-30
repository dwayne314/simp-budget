import React from 'react';
import DatePicker from 'react-datepicker';
import Button from '../Button/Button'; 
import { Link } from 'react-router-dom';
import './Form.css';


const Form = (props) => {

    const { formHeader, fields, bottomText='', formErrors='', submit, submitCTA } = props;
    const formFields = fields.map(field => (
         <div className="form-item-container">
            <div className="form-label">
                <label htmlFor={field.id}>{field.name}</label>
            </div>
            {(() => {

                if (field.inputType === 'date') { 
                    return (
                        <div className="date-picker-container">
                            <DatePicker
                                selected={field.value}
                                onChange={date => field.onChange(date)}
                                dateFormat='MMMM d, yyyy'>
                            </DatePicker>
                        </div>
                    );
                }
                else if (field.inputType === 'currency') {
                    return (
                            <div className="form-input">
                                <input id={field.id} className="currency-input" onChange={field.onChange} type="number" value={field.value}/>
                                <span className="currency-indicator">$</span>
                            </div>
                    );
                }
                else {
                    return (
                        <div className="form-input">
                            <input id={field.id} onChange={field.onChange} type={(field.inputType ? field.inputType : "text")} value={field.value}/>
                        </div>
                    );
                }
            })()}
            {(field.errors) ? 
                <span className="form-errors">{`* ${field.errors}`}</span> : 
                ""
            }
        </div>
    ));

    const footerText = (!bottomText) ? "" : (
        <div className="form-bottom-text-container">
            <div className="form-bottom-text">
                {bottomText.introText}<Link to={bottomText.linkTo}>{bottomText.linkText}</Link>
            </div>
        </div>
    );

    return (
        <div className="form-container">
            <div className="form-header">
                {formHeader}
            </div>
            {formErrors ? 
                <div className="form-errors-container">
                    <div className="form-errors">{`${formErrors}`}</div>
                </div>
                :
                ""
            }
            <div className="form">
                <form>
                    {formFields}
                    <div className="form-item-container form-button-container">
                        <Button onClick={submit} cta={submitCTA} isPrimary={false}/>
                    </div>                        
                </form>
            </div>
            {footerText}

        </div>   
    );
};


export default Form;
