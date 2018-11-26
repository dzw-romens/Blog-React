import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./src/routes/router";
import reducers from './src/reducers/reducers';

ReactDOM.render(
    <Provider store={createStore(reducers)}>
      <Router>
          <Routes />
      </Router>,
    </Provider>,
    document.getElementById('root') as HTMLElement
  );