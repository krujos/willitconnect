/* eslint-env node, mocha, browser */

import React from 'react';
import { shallow, mount } from 'enzyme';
import td from 'testdouble';
import EntryForm from '../../main/script/EntryForm';

describe('EntryForm', () => {
  const mixpanel = { track: () => {} };

  beforeEach(function() {
    window.mixpanel = mixpanel;
  });

  it('displays the form', () => {
    const entryForm = shallow(<EntryForm />);
    // console.log(entryForm.debug());
    expect(entryForm.is('Form')).to.equal(true);
  });

  describe('a valid host and port are provided', () => {
    it('should submit the host and port', () => {
      const onSubmit = td.function('.onSubmit');
      const entryForm = mount(<EntryForm host="http://script.com" port="80" onSubmit={onSubmit} />);
      entryForm.simulate('submit');
      td.verify(onSubmit({
        host: 'http://script.com',
        port: '80',
        proxyHost: null,
        proxyPort: null
      }));
    });

    it('should populate the entry from props', () => {
      const entryForm = mount(<EntryForm host="script.com" port="80" />);
      const hostField = entryForm.find('input[name="host"]');
      const portField = entryForm.find('input[name="port"]');
      expect(hostField.prop('value')).to.eq('script.com');
      expect(portField.prop('value')).to.eq('80');
    });
  });

  context('when a proxy is provided', () => {
    xit('should submit the host and port and proxy', () => {
      const onSubmit = td.function('.onSubmit');
      const entryForm = mount(<EntryForm host="http://script.com" port="80" proxyHost="www.com" proxyPort="8080" onSubmit={onSubmit} />);
      const toggle = entryForm.find('input[type="checkbox"]');
      toggle.simulate('change');
      entryForm.simulate('submit');

      expect(toggle.prop('checked')).to.eq(true);

      td.verify(onSubmit({
        host: 'http://script.com',
        port: '80',
        proxyHost: 'www.com',
        proxyPort: '8080',
      }));
    });

    it('should populate the entry from props', () => {
      const entryForm = mount(<EntryForm host="http://script.com" port="80" proxyHost="www.com" proxyPort="8080" />);
      entryForm.find('input[type="checkbox"]').simulate('change');
      const hostField = entryForm.find('input[name="proxyHost"]');
      const portField = entryForm.find('input[name="proxyPort"]');
      expect(hostField.prop('value')).to.eq('www.com');
      expect(portField.prop('value')).to.eq('8080');
    });

  });
});
