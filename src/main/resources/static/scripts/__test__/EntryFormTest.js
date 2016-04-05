'use strict';
jest.dontMock('../EntryForm');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const EntryForm = require('../EntryForm');


describe('EntryForm', () => {

    var entryForm, renderedEntryForm;

    beforeEach(function() {
        entryForm = TestUtils.renderIntoDocument(<EntryForm />);
        renderedEntryForm = ReactDOM.findDOMNode(entryForm);

    });

    it("displays the form", function() {
        expect(renderedEntryForm.children.length).toEqual(2);
        let row1 = renderedEntryForm.children[0];
        expect(row1.children.length).toEqual(3);

        let row2 = renderedEntryForm.children[0];
        expect(row2.children.length).toEqual(3);

    });

    it("requires the port by default", function() {
        expect(entryForm.isPortRequired()).toBe(true);
    });
    
});
