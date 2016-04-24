jest.dontMock('../HeaderBar');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { NavItem } from 'react-bootstrap';
const HeaderBar = require('../HeaderBar');

//http://reactkungfu.com/2015/07/approaches-to-testing-react-components-an-overview/
describe('HeaderBar', () => {

    it('has a link to the github repo', () => {

        var headerbar = TestUtils.renderIntoDocument(<HeaderBar />);
        var href = TestUtils.scryRenderedDOMComponentsWithTag(headerbar, 'a')[1];

        expect((href.getAttribute('href')) === 'https://github.com/krujos/willitconnect');
    });
});

