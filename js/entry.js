import React from 'react';
import Router from 'react-router';

const Route = Router.Route,
    DefaultRoute = Router.DefaultRoute;

import Main from './components/Main';
import View from './components/View';

import { createDispatcher } from 'dispatchr';
import GistStore from './stores/GistStore';

const dispatcher = createDispatcher({
    stores: [GistStore]
}).createContext({});

Router.run(
    <Route path="/">
        <DefaultRoute handler={Main} />
        <Route path="/paste/:url" handler={View} />
    </Route>,
    Router.HistoryLocation,
    (Handler) => {
        const props = {
            dispatcher
        };

        React.render(<Handler {...props} />, document.body);
    }
);
