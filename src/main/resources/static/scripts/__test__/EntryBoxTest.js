'use strict';
jest.dontMock('../EntryBox');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jquery from 'jquery';
const EntryBox = require('../EntryBox');
import {createRenderer} from 'react-addons-test-utils';

describe('EntryBox', () => {

    var entryBox, renderedEntry;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
    });

    it("displays the entryBox", function() {
        entryBox = TestUtils.renderIntoDocument(<EntryBox />);
        renderedEntry = ReactDOM.findDOMNode(entryBox);
        expect(renderedEntry.children.length).toEqual(2);

        let bar = renderedEntry.children[0];
        expect(bar.children.length).toEqual(0);

        let row = renderedEntry.children[1];
        expect(row.children.length).toEqual(2);
    });

});
