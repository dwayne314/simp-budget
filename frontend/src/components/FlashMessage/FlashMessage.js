import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Close from '../../static/icons/close-white.svg';
import Icon from '../../components/Icon/Icon';
import { flashMessages } from '../../redux/selectors';
import { setFlashMessages, removeFlashMessage } from '../../redux/actions';
import './FlashMessage.css';


const FlashMessage = (props) => {

    const colorMapper = {
        'error': '#c63a3a',
        'success': '#3ac672'
    }

    const messages = useSelector(flashMessages);
    const dispatch = useDispatch();

    const showMessages = messages.map((message, index) => (
        <div key={`message ${message.id}`} className="flash-message-container" style={{backgroundColor: colorMapper[message.messageType]}}>
            <div className="flash-message-sub-container">
                <div className="flash-message">
                    {message.message}
                </div>
                <div className="close-message-icon">
                        <div className="close-message-icon">
                            <Icon
                                type={Close} 
                                alt="X-icon"
                                onClick={() => dispatch(removeFlashMessage(message.id))}
                            />
                        </div>

                </div>
            </div>
        </div>
    ));

    useEffect(() => {
        if (messages.length) {
            const clearLastMessage = window.setTimeout(() => {
                dispatch(setFlashMessages(messages.slice(1)));
            }, 3000);

            return () => {
                window.clearTimeout(clearLastMessage);
            };    
        }
        

    }, [dispatch, messages]);

    return (
        (messages.length) ? 
        <div className="flash-messages-container">
            {showMessages}
        </div>
        : ""
    );
}

export default FlashMessage;
