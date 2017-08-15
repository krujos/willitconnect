'use strict';

import React from 'react';
import EntryList from '../../main/script/EntryList';
import { shallow } from 'enzyme';

describe('EntryList', () => {
    
    const mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
    });

    const entry0 = {"host": "google.com", "port": "80", "proxyHost": undefined, "proxyPort": undefined};
    const entry1 = {"host": "test.com", "port": "80", "status": "{canConnect:true}", "proxyHost": "", "proxyPort": ""};
    const entry2 = {"host":"test2.com", "port": "70", "status":"{canConnect:false}", "proxyHost":"proxy.com", "proxyPort":"60"};
    const entries = [];
    entries.push(entry0);
    entries.push(entry1);
    entries.push(entry2);

    it("displays the entryList", function() {
        const entryList = shallow(<EntryList data={entries} />);
        expect(entryList.find('StatelessEntry').length).to.eq(3);
        expect(entryList.find('StatelessEntry').at(2).prop('host')).to.equal("google.com");
        expect(entryList.find('StatelessEntry').at(1).prop('port')).to.equal('80');
        expect(entryList.find('StatelessEntry').at(0).prop('status')).to.equal('{canConnect:false}');
    });
    
});
