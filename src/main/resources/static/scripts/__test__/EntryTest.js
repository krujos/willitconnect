'use strict';
jest.dontMock('../Entry');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const Entry = require('../Entry');

describe('Entry', () => {

    var entry, renderedEntry;

    beforeEach(function() {
        entry = TestUtils.renderIntoDocument(<Entry />);
        renderedEntry = ReactDOM.findDOMNode(entry);

    });

    it("displays the entry", function() {
        expect(renderedEntry.children.length).toEqual(1);
        let div = renderedEntry.children[0];
        expect(div.children.length).toEqual(0);
    });

    it("displays a host and port", function() {

    });
    

});
