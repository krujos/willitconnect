'use strict';
jest.dontMock('../Entry');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jquery from 'jquery';
const Entry = require('../Entry');
import {createRenderer} from 'react-addons-test-utils';

describe('Entry', () => {

    var entry, renderedEntry;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        entry = TestUtils.renderIntoDocument(<Entry />);
        renderedEntry = ReactDOM.findDOMNode(entry);
        window.mixpanel = mixpanel;
    });

    it("displays the entry", function() {
        entry = TestUtils.renderIntoDocument(<Entry />);
        renderedEntry = ReactDOM.findDOMNode(entry);
        expect(renderedEntry.children.length).toEqual(1);
        let div = renderedEntry.children[0];
        expect(div.children.length).toEqual(0);
    });

    it("displays a host and port with successful connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("green");
    });

    it("displays a host and port with unsuccessful connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": false}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("red");
    });

    it("displays a host and port with successful proxy connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"
                                                    proxyHost="test.com" proxyPort="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("green");
    });

    it("displays a host and port with unsuccessful proxy connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"
                                                    proxyHost="test.com" proxyPort="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": false}));
        
        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("red");
    });

    it("displays a host and port without a canConnect response", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("blue");

    });

    it("displays a host and port with a status code", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true, "statusCode": "200"}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80 status: 200");
        expect(renderedEntry.style._values.color).toEqual("green");

    });

    it("displays a host and port without a canConnect response", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("blue");
    });
});
