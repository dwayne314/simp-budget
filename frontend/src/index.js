import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import store, { persistor } from './redux/store';
import { BrowserRouter } from 'react-router-dom';

import App from './App/App'
import './index.css';


ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);
