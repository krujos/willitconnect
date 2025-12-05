'use strict';

import React from 'react';
import EntryList from '../../main/script/EntryList';
import { render, screen } from '@testing-library/react';

describe('EntryList', () => {
    
    const mixpanel = {
        track: function () {}
    };

    beforeEach(function() {
        window.mixpanel = mixpanel;
    });

    const entry0 = {"id": "0", "host": "google.com", "port": "80", "proxyHost": undefined, "proxyPort": undefined};
    const entry1 = {"id": "1", "host": "test.com", "port": "80", "status": "{canConnect:true}", "proxyHost": "", "proxyPort": ""};
    const entry2 = {"id": "2", "host":"test2.com", "port": "70", "status":"{canConnect:false}", "proxyHost":"proxy.com", "proxyPort":"60"};
    const entries = [];
    entries.push(entry0);
    entries.push(entry1);
    entries.push(entry2);

    it("displays the entryList", function() {
        render(<EntryList data={entries} />);
        
        // Check that entries are rendered by looking for host names
        expect(screen.getByText(/google\.com/)).to.exist;
        expect(screen.getByText(/test\.com/)).to.exist;
        expect(screen.getByText(/test2\.com/)).to.exist;
    });
    
});
