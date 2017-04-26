import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from './redux/store';
import Routes from './modules/Routes';

const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            {Routes()}
        </BrowserRouter>
    </Provider>
    ), document.getElementById('app'),
);
