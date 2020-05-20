import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { flashMessages } from '../../redux/selectors';
import { setFlashMessages } from '../../redux/actions';
import './FlashMessage.css';


const FlashMessage = (props) => {

    const colorMapper = {
        'error': '#d85d52',
        'success': '#80d250'
    }

    const messages = useSelector(flashMessages);
    const dispatch = useDispatch();

    const showMessages = messages.map((message, index) => (
        <div key={`message ${index}`} className="flash-message" style={{backgroundColor: colorMapper[message.messageType]}}>
            {message.message}
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

    useEffect(() => {
    })


    return (
        (messages.length) ? 
        <div className="flash-message-container">
            {showMessages}
        </div>
        : ""
    );
}

export default FlashMessage;
