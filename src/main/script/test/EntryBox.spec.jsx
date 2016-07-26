'use strict';

import React from 'react';
import EntryBox from '../EntryBox';
import { shallow } from 'enzyme';

describe('EntryBox', () => {

    var mixpanel = {
        track: function () {}
    };

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
