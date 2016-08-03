'use strict';

import React from 'react';
import { EntryBox } from '../../main/script/EntryBox';
import { shallow } from 'enzyme';

describe('EntryBox', () => {

  const mixpanel = { track: () => {} };

  beforeEach(function() {
      window.mixpanel = mixpanel;
  });

  it("displays the entryBox", function() {
      const entryBox = shallow(<EntryBox />);
      expect(entryBox.contains('HeaderBar'));
      expect(entryBox.contains('EntryForm'));
      expect(entryBox.contains('EntryList'));
  });

});
