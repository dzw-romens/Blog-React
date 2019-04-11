import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logger  from 'redux-logger';
import Routes from "./src/routes/router";
import reducers from './src/reducers/reducers';

let  middleware = [thunkMiddleware, logger];
const store = createStore(reducers, applyMiddleware(...middleware));
console.log(store);
ReactDOM.render(
    <Provider store={store}>
         <Routes />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );