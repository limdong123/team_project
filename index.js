/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native';
import App from './app/index';
import { name as appName } from './app.json';

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import reducers from './app/store/reducers'
import ThunkMiddleware from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const createStoreWithMiddleware = createStore(reducers, composeEnhancers(
    applyMiddleware(promiseMiddleware, ThunkMiddleware)
))

const appRedux = () => (
    <Provider store={createStoreWithMiddleware}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => appRedux);
