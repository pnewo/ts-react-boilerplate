import * as React from 'react';
import { Route } from 'react-router-dom';
import IndexContainer from './index/IndexView';

const App: React.StatelessComponent<undefined> = () => (
    <div className="app-base">
        <Route component={IndexContainer} />
    </div>
);

export default App;
