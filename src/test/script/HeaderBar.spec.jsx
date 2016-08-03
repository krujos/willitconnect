import React from 'react';
const HeaderBar = require('../../main/script/HeaderBar');
import { shallow } from 'enzyme';

describe('HeaderBar', () => {
    it("has a link to the github repo", function() {
        const bar = shallow(<HeaderBar />);
        expect(bar.contains('NavItem'));
        expect(bar.find('NavItem').contains('span'));
    });
});

