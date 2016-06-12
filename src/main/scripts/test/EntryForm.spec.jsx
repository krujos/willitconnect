'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const EntryForm = require('../EntryForm');
import { shallow } from 'enzyme';


describe('EntryForm', () => {

    var entryForm, renderedEntryForm;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
        
    });

    it("displays the form", function() {
        const entryForm = shallow(<EntryForm />);
        console.log(entryForm.debug());
        expect(entryForm.is('form')).to.equal(true);
        // expect(renderedEntryForm.children.length).toEqual(3);
        // let row1 = renderedEntryForm.children[0];
        // expect(row1.children.length).toEqual(2);
        //
        // let row2 = renderedEntryForm.children[1];
        // expect(row2.children.length).toEqual(1);

    });
    
    //
    // it ("does not require a port when host is a url", function() {
    //     let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
    //     host.value = "http://test.com";
    //     TestUtils.Simulate.change(host);
    //     expect(entryForm.isPortRequired()).toBe(false);
    // });
    
    describe("valid port host conbinations", function() {
        
        xit("should be valid with a url" , function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "http://test.com";
            expect(entryForm.isValid()).toBe(true);
        });
        
        xit("should be valid with a host and a port", function() {
            let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
            host.value = "test.com";
            let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
            port.value = 50;
            expect(entryForm.isValid()).toBe(true);
        });

        xit("should not be valid with a host and no port", function() {
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

        xit("updates proxy flag when checkbox is used" , function() {
            let box = TestUtils.findRenderedDOMComponentWithClass(entryForm, "proxyBox");
            expect(entryForm.state.isChecked).toBe(false);
            TestUtils.Simulate.change(box);
            expect(entryForm.state.isChecked).toBe(true);
        });

        xit("uses the proxy when proxybox is checked", function() {
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
                .toBe('testproxy.com');
            expect(entryForm.connect.mock.calls[0][3])
                .toBe('70');
        });

        xit("doesn't use the proxy when proxybox is checked, but no proxy values are entered", function() {
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
    })
});
