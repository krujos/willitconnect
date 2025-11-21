/* eslint-env browser */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import EntryBox from './EntryBox';
import reducers from './reducers';

require('bootstrap/dist/css/bootstrap.min.css');

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

const container = document.getElementById('content');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <EntryBox />
  </Provider>
);

mixpanel.track('page loaded');
