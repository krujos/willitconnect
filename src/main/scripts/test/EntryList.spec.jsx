'use strict';

import React from 'react';
import EntryList from '../EntryList';
import { shallow } from 'enzyme';

describe('EntryList', () => {
    
    var mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
    });

    var entry0 = {"host": "google.com", "port": "80", "proxyHost": undefined, "proxyPort": undefined};
    var entry1 = {"host":"test.com", "port": "80", "status":"{canConnect:true}", "proxyHost":"", "proxyPort":""};
    var entry2 = {"host":"test2.com", "port": "70", "status":"{canConnect:false}", "proxyHost":"proxy.com", "proxyPort":"60"};
    var entries = [];
    entries.push(entry0);
    entries.push(entry1);
    entries.push(entry2);

    it("displays the entryList", function() {
        const entryList = shallow(<EntryList data={entries} />);
        expect(entryList.find('StatefulEntry')).to.have.length.of(3);
        expect(entryList.find('StatefulEntry').at(2).prop('host')).to.equal("google.com");
        expect(entryList.find('StatefulEntry').at(1).prop('port')).to.equal('80');
        expect(entryList.find('StatefulEntry').at(0).prop('status')).to.equal('{canConnect:false}');
    });
    
});
