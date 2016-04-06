'use strict';
jest.dontMock('../EntryList');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
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

    var entry0 = {"host": "google.com", "port": "80", "proxyHost": undefined, "proxyPort": undefined};
    var entry1 = {"host":"test.com", "port": "80", "status":"{canConnect:true}", "proxyHost":"", "proxyPort":""};
    var entry2 = {"host":"test2.com", "port": "70", "status":"{canConnect:false}", "proxyHost":"proxy.com", "proxyPort":"60"}
    var entries = [];
    entries.push(entry0);
    entries.push(entry1);
    entries.push(entry2);

    it("displays the entryList", function() {
        entryList = TestUtils.renderIntoDocument(<EntryList data={entries} />);
        renderedEntry = ReactDOM.findDOMNode(entryList);
        expect(renderedEntry.children.length).toEqual(3);
    });
    
});
