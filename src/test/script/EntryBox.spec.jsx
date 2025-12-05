'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen } from '@testing-library/react';
import { EntryBox } from '../../main/script/EntryBox';
import reducers from '../../main/script/reducers';

describe('EntryBox', () => {

  const mixpanel = { track: () => {} };

  beforeEach(function() {
      window.mixpanel = mixpanel;
  });

  it("displays the entryBox", function() {
      const store = createStore(reducers);
      render(
        <Provider store={store}>
          <EntryBox />
        </Provider>
      );
      
      // Check that form elements are present (EntryForm renders input fields)
      expect(screen.getByPlaceholderText(/Host/i)).to.exist;
      expect(screen.getByPlaceholderText(/Port/i)).to.exist;
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /Check/i })).to.exist;
  });

});
