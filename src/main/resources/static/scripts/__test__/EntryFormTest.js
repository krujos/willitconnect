'use strict';
jest.dontMock('../EntryForm');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const EntryForm = require('../EntryForm');


describe('EntryForm', () => {

    var entryForm, renderedEntryForm;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
        entryForm = TestUtils.renderIntoDocument(<EntryForm />);
        renderedEntryForm = ReactDOM.findDOMNode(entryForm);
    });

    it("displays the form", function() {
        expect(renderedEntryForm.children.length).toEqual(2);
        let row1 = renderedEntryForm.children[0];
        expect(row1.children.length).toEqual(3);

        let row2 = renderedEntryForm.children[1];
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
        });
    });

    describe("uses the proxy information appropriately", function() {

        var event = {
            type: 'click',
            preventDefault: function () {}
        };

        beforeEach(function() {
            entryForm.connect = jest.genMockFunction();
        });

        it("updates proxy flag when checkbox is used" , function() {
            let box = TestUtils.findRenderedDOMComponentWithClass(entryForm, "proxyBox");
            expect(entryForm.state.isChecked).toBe(false);
            TestUtils.Simulate.change(box);
            expect(entryForm.state.isChecked).toBe(true);
        });

        it("uses the proxy when proxybox is checked", function() {
            let box = TestUtils.findRenderedDOMComponentWithClass(entryForm, "proxyBox");
            expect(entryForm.state.isChecked).toBe(false);
            TestUtils.Simulate.change(box);
            expect(entryForm.state.isChecked).toBe(true);

            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
            port.value = 50;

            expect(entryForm.isValid()).toBe(true);

            let proxyHost = TestUtils.findRenderedDOMComponentWithClass(entryForm,
                "proxyHost");
            proxyHost.value = "testproxy.com";
            let proxyPort = TestUtils.findRenderedDOMComponentWithClass(entryForm,
                "proxyPort");
            proxyPort.value = 70;

            entryForm.handleSubmit(event);

            expect(entryForm.connect.mock.calls[0][0])
                .toBe('test.com');
            expect(entryForm.connect.mock.calls[0][1])
                .toBe('50');
            expect(entryForm.connect.mock.calls[0][2])
                .toBe('70');
            expect(entryForm.connect.mock.calls[0][3])
                .toBe('testproxy.com');
        });

        it("doesn't use the proxy when proxybox is checked, but no proxy values are entered", function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
            port.value = 50;

            expect(entryForm.isValid()).toBe(true);

            var event = {
                type: 'click',
                preventDefault: function () {}
            };
            entryForm.handleSubmit(event);

            expect(entryForm.connect.mock.calls[0][0])
                .toBe('test.com');
            expect(entryForm.connect.mock.calls[0][1])
                .toBe('50');
            expect(entryForm.connect.mock.calls[0][2])
                .toBe(undefined);
            expect(entryForm.connect.mock.calls[0][3])
                .toBe(undefined);
        });

        it("doesn't use the proxy when proxybox is checked, but values are entered", function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
            port.value = 50;

            expect(entryForm.isValid()).toBe(true);

            let proxyHost = TestUtils.findRenderedDOMComponentWithClass(entryForm,
                "proxyHost");
            proxyHost.value = "testproxy.com";
            let proxyPort = TestUtils.findRenderedDOMComponentWithClass(entryForm,
                "proxyPort");
            proxyPort.value = 70;

            var event = {
                type: 'click',
                preventDefault: function () {}
            };
            entryForm.handleSubmit(event);

            expect(entryForm.connect.mock.calls[0][0])
                .toBe('test.com');
            expect(entryForm.connect.mock.calls[0][1])
                .toBe('50');
            expect(entryForm.connect.mock.calls[0][2])
                .toBe(undefined);
            expect(entryForm.connect.mock.calls[0][3])
                .toBe(undefined);
        });
    })
});
