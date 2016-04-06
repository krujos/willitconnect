'use strict';
jest.dontMock('../EntryList');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jquery from 'jquery';
const EntryList = require('../EntryList');
import {createRenderer} from 'react-addons-test-utils';

describe('EntryList', () => {

    var entryList, renderedEntry;

    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
    });

    xit("displays the entryList", function() {
        entryList = TestUtils.renderIntoDocument(<EntryList data={""} />);
        renderedEntry = ReactDOM.findDOMNode(entryList);
        expect(renderedEntry.children.length).toEqual(2);

        let bar = renderedEntry.children[0];
        expect(bar.children.length).toEqual(0);

        let row = renderedEntry.children[1];
        expect(row.children.length).toEqual(2);
    });

    xit("handles submissions", function() {
        entryList = TestUtils.renderIntoDocument(<EntryList host="test.com" port="80"/>);
        jquery.ajax = jest.fn(() =>
            entryList.successFunc({"canConnect": true}));

        entryList.componentWillMount();
        renderedEntry = ReactDOM.findDOMNode(entryList);

        expect(renderedEntry.children[0].textContent).toEqual("test.com:80");
        expect(renderedEntry.style._values.color).toEqual("green");
    });

});
