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

    it ("does not require a port when host is a url", function() {
        let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
        host.value = "http://test.com";
        TestUtils.Simulate.change(host);
        expect(entryForm.isPortRequired()).toBe(false);
    });
    
    describe("valid port host conbinations", function() {
        
        it("should be valid with a url" , function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "http://test.com";
            expect(entryForm.isValid()).toBe(true);
        });
        
        it("should be valid with a host and a port", function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
            port.value = 50;
            expect(entryForm.isValid()).toBe(true);
        });

        it("should not be valid with a host and no port", function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            expect(entryForm.isValid()).toBe(false);
            console.log("done");
        });
        
  
    })
});
