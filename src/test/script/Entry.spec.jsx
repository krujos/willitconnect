/* eslint-env node, mocha */
import { shallow, mount } from 'enzyme';
import React from 'react';
import StatelessEntry from '../../main/script/Entry';
import { PASSED, FAILED } from '../../main/script/actions/entry-actions'

describe('Entry', () => {

  it('displays the entry', () => {
    const props = {
      host: '',
      port: '',
      status: '',
      connections: [],
    };
    const entry = shallow(<StatelessEntry {...props} />);
   // console.log(entry.debug());
    expect(entry.is('Result')).to.equal(true);
  });

  it('displays a host and port with successful connection', () => {
    const props = {
      host: 'google.com',
      port: '80',
      status: 'PASSED',
      connections: [{ id: '0', canConnect: 'true', time: 1460727927955 }],
    };

    const stateEntry = mount(<StatelessEntry {...props} />);
    expect(stateEntry.find('Result').prop('status')).to.equal(PASSED);

    expect(stateEntry.find('div').at(2).prop('children')[0]).to.equal('google.com:80');
    expect(stateEntry.find('Entry').first().prop('success')).to.equal('true');
    expect(stateEntry.find('Entry').first().prop('httpStatus')).to.equal(undefined);
    expect(stateEntry.find('Entry').first().prop('time')).to.match(/April 15, 2016/);
  });

  it('displays a host and port with unsuccessful connection', () => {
    const props = {
      host: 'test.com',
      port: '80',
      status: 'FAILED',
      connections: [{ id: '0', canConnect: 'false', time: 1460727927955 }],
    };
    const stateEntry = mount(<StatelessEntry {...props} />);
    expect(stateEntry.find('Result').prop('status')).to.equal(FAILED);
    expect(stateEntry.find('div').at(2).prop('children')[0]).to.equal('test.com:80');
    const entry = stateEntry.find('Entry');
    expect(entry.prop('success')).to.equal('false');
    expect(entry.prop('httpStatus')).to.equal(undefined);
    expect(stateEntry.find('Entry').first().prop('time')).to.match(/April 15, 2016/);
  });

  it('displays a host and port with successful proxy connection', () => {
    const props = {
      host: 'test.com',
      port: '80',
      proxyHost: 'testProxy.com',
      proxyPort: '8080',
      status: 'PASSED',
      connections: [{ id: '0', canConnect: 'true', time: 1460727927955 }],
    };

    const stateEntry = mount(<StatelessEntry {...props} />);
    const result = stateEntry.find('Result');
    expect(result.prop('status')).to.equal(PASSED);
    expect(stateEntry.find('div').at(2).prop('children')[0]).
    to.equal('test.com:80 proxied through testProxy.com:8080');

    const entry = stateEntry.find('Entry');
    expect(entry.prop('success')).to.equal('true');
    expect(entry.prop('httpStatus')).to.equal(undefined);
    expect(stateEntry.find('Entry').first().prop('time')).to.match(/April 15, 2016/);
  });

  it('displays a host and port without a response', () => {
      const props = {
          host: 'test.com',
          port: '80',
          status: 'SUBMIT',
          connections: [],
      };

      const stateEntry = mount(<StatelessEntry {...props} />);
      const result = stateEntry.find('Result');
      expect(result.prop('status')).to.equal('SUBMIT');
      expect(stateEntry.contains('Entry')).to.equal(false);
  });

  it('displays a host and port with a status code', () => {
    const props = {
      host: 'test.com',
      port: '80',
      status: 'SUCCESS',
      connections: [{ id: 0, canConnect: true, httpStatus: 200, time: 1360727327500 }],
    };

    const stateEntry = mount(<StatelessEntry {...props} />);

    const result = stateEntry.find('Result');
    expect(result.prop('status')).to.equal('SUCCESS');

    expect(stateEntry.find('div').at(2).prop('children')[0]).to.equal('test.com:80');

    const entry = stateEntry.find('Entry');
    expect(entry.prop('success')).to.equal(true);
    expect(entry.prop('httpStatus')).to.equal(200);
    expect(entry.prop('time')).to.match(/February 1/);
  });
});
