/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import EntryBox from './EntryBox';
import reducers from './reducers';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);


ReactDOM.render(
  <Provider store={store}>
    <EntryBox />
  </Provider>,
  document.getElementById('content')
);

mixpanel.track('page loaded');
