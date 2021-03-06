import React from 'react';
import DatePicker from 'react-datepicker';
import Button from '../Button/Button'; 
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import { Link } from 'react-router-dom';
import './Form.css';


const Form = (props) => {

    const { formHeader, fields, bottomText='', formErrors='', additionalText='', submit, submitCTA } = props;
    const textFieldFormTypes = ['text', 'password']

    const formFields = fields.map((field, index) => {
        if (!field.isHidden) {
            return (
             <div key={`form-field-${index}`} className={`form-item-container${field.horizontalAlign ? ' form-item-vertical' : ''}`}>
                <div className="form-label">
                    <label htmlFor={field.id}>{field.name}</label>
                    {(() => {
                        if (field.additionalText) {
                            return (
                                <div className="form-label-link">
                                    <Link to={field.additionalText.linkTo}>{field.additionalText.cta}</Link>       
                                </div>
                            )
                        }
                    })()}
                    {(() => {
                        if (field.onClear && field.value) {
                            return (
                                <span className='clear-field-btn'onClick={field.onClear}>
                                    Clear
                                </span>
                            );
                        }
                    })()}
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
                                    <input 
                                        id={field.id}
                                        className="currency-input"
                                        onChange={field.onChange}
                                        type="number"
                                        value={field.value}
                                    />
                                    <span className="currency-indicator">$</span>
                                </div>
                        );
                    }
                    else if (field.inputType === 'toggle') {
                        return (
                            <div className="form-toggle-input">
                                <ToggleSwitch 
                                    id={field.id}
                                    isToggled={field.value} 
                                    handleToggle={field.onChange}/>
                            </div>
                        )
                    }
                    else if (field.inputType === 'dropdown') {
                        return (
                            <div className="form-input">
                                <DropdownList 
                                    data={field.data}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </div>
                        )
                    }
                    else {
                        const fieldType = field.inputType ? field.inputType : 'text'
                        return (
                            <div className={`form-input${textFieldFormTypes.indexOf(fieldType) !== -1 ? ' text-input' : ''}`}>
                                <input id={field.id} onChange={field.onChange} type={fieldType} value={field.value}/>
                            </div>
                        );
                    }
                })()}
                {(field.errors) ? 
                    <span className="form-errors">{`* ${field.errors}`}</span> : 
                    ""
                }
            </div>
        )}
        else {
            return '';
        }
    });

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
