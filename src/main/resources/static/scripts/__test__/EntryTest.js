'use strict';
jest.dontMock('../Entry');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jquery from 'jquery';
import StatefulEntry, { Entry, Result } from '../Entry';
import {createRenderer} from 'react-addons-test-utils';

describe( 'Entry', () => {
    // success,
    // httpStatus,
    // time,
    it( 'says "I can connect" when successful', () => {
        // <Entry success />
        
    } )
    it( 'Shows http status when > 0', () => {
        // <Entry httpStatus={ 0 } />
        // <Entry httpStatus={ -1 } />
        // <Entry httpStatus={ 1 } />
    } )
} )
describe( 'Result', () => {
    // success, pending
    describe( 'pending', () => {
        it( 'shows a progress bar', () => {

        } )
        it( 'has class "info"', () => {} )
    } )
    describe( 'failure', () => {} )
    describe( 'success', () => {} )
} )

describe('Entry', () => {

    var entry, renderedEntry;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        entry = TestUtils.renderIntoDocument(<StatefulEntry />);
        renderedEntry = ReactDOM.findDOMNode(entry);
        window.mixpanel = mixpanel;
    });

    xit("displays the entry", function() {
        entry = TestUtils.renderIntoDocument(<Entry />);
        renderedEntry = ReactDOM.findDOMNode(entry);
        expect(renderedEntry.children.length).toEqual(1);
        let div = renderedEntry.children[0];
        expect(div.children.length).toEqual(1);
    });

    xit("displays a host and port with successful connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true, "lastChecked": 1460727927955}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.classList[1]).toEqual("panel-success");
        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.children[1].children[0].children[0].textContent).toMatch(/ I can connect Time checked: 3-5-2016/);

    });

    xit("displays a host and port with unsuccessful connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": false, "lastChecked": 1460727927955}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.classList[1]).toEqual("panel-danger");
        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.children[1].children[0].children[0].textContent).toMatch(/ I cannot connect Time checked: 3-5-2016/);

    });

    xit("displays a host and port with successful proxy connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"
                                                    proxyHost="test.com" proxyPort="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80 proxied through test.com:80");
        expect(renderedEntry.classList[1]).toEqual("panel-success");
    });

    xit("displays a host and port with unsuccessful proxy connection", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"
                                                    proxyHost="test.com" proxyPort="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": false}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80 proxied through test.com:80");
        expect(renderedEntry.classList[1]).toEqual("panel-danger");
    });

    xit("displays a host and port without a canConnect response", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.classList[1]).toEqual("panel-info");
    });

    xit("displays a host and port with a status code", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({"canConnect": true, "statusCode": "200"}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.classList[1]).toEqual("panel-success");

    });

    xit("displays a host and port without a canConnect response", function() {
        entry = TestUtils.renderIntoDocument(<Entry host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entry.successFunc({}));

        entry.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entry);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.classList[1]).toEqual("panel-info");
    });
});
