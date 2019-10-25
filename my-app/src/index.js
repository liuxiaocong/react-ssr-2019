import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import { StoreContext } from 'redux-react-hook';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import rootSaga from './sagas';
import rootReducer from './reducers';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, thunk];
const storeEnhancer = composeWithDevTools(applyMiddleware(...middlewares));
console.log(window.__PRELOADED_STATE__);
let preloadedState = window.__PRELOADED_STATE__ || {};
const store = createStore(rootReducer, preloadedState, storeEnhancer);
sagaMiddleware.run(rootSaga);

ReactDOM.hydrate(
  <Provider store={ store }>
    <StoreContext.Provider value={ store }>
      <Router>
        <App/>
      </Router>
    </StoreContext.Provider>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
