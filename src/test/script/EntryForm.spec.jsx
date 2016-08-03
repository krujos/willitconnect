/* eslint-env node, mocha */

import React from 'react';
// import TestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
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
  //
  // describe('valid port host combinations', () => {
  //
  //   it('should be valid with a url', () => {
  //     const form = mount(<EntryForm/>);
  //     const host = form.find('host');
  //     host.value = 'http://script.com';
  //     expect(entryForm.isValid()).to.equal(true);
  //   });
  //
  //   xit("should be valid with a host and a port", function() {
  //     let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
  //     host.value = "test.com";
  //     let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
  //     port.value = 50;
  //     expect(entryForm.isValid()).toBe(true);
  //   });
  //
  //   xit("should not be valid with a host and no port", function() {
  //     let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
  //     host.value = "test.com";
  //     expect(entryForm.isValid()).toBe(false);
  //   });
  // });
  //
  // describe("uses the proxy information appropriately", function() {
  //
  //   var event = {
  //     type: 'click',
  //     preventDefault: () => {},
  //   };
  //
  //   beforeEach(function() {
  //     entryForm.connect = jest.genMockFunction();
  //   });
  //
  //   xit("updates proxy flag when checkbox is used", function() {
  //     let box = TestUtils.findRenderedDOMComponentWithClass(entryForm, "proxyBox");
  //     expect(entryForm.state.isChecked).toBe(false);
  //     TestUtils.Simulate.change(box);
  //     expect(entryForm.state.isChecked).toBe(true);
  //   });
  //
  //   xit("uses the proxy when proxybox is checked", function() {
  //     let box = TestUtils.findRenderedDOMComponentWithClass(entryForm, "proxyBox");
  //     expect(entryForm.state.isChecked).toBe(false);
  //     TestUtils.Simulate.change(box);
  //     expect(entryForm.state.isChecked).toBe(true);
  //
  //     let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
  //     host.value = "test.com";
  //     let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
  //     port.value = 50;
  //
  //     expect(entryForm.isValid()).toBe(true);
  //
  //     let proxyHost = TestUtils.findRenderedDOMComponentWithClass(entryForm,
  //       "proxyHost");
  //     proxyHost.value = "testproxy.com";
  //     let proxyPort = TestUtils.findRenderedDOMComponentWithClass(entryForm,
  //       "proxyPort");
  //     proxyPort.value = 70;
  //
  //     entryForm.handleSubmit(event);
  //
  //     expect(entryForm.connect.mock.calls[0][0])
  //       .toBe('test.com');
  //     expect(entryForm.connect.mock.calls[0][1])
  //       .toBe('50');
  //     expect(entryForm.connect.mock.calls[0][2])
  //       .toBe('testproxy.com');
  //     expect(entryForm.connect.mock.calls[0][3])
  //       .toBe('70');
  //   });
  //
  //   xit("doesn't use the proxy when proxybox is checked, but no proxy values are entered", function() {
  //     let host = TestUtils.findRenderedDOMComponentWithClass(entryForm, "host");
  //     host.value = "test.com";
  //     let port = TestUtils.findRenderedDOMComponentWithClass(entryForm, "port");
  //     port.value = 50;
  //
  //     expect(entryForm.isValid()).toBe(true);
  //
  //     var event = {
  //       type: 'click',
  //       preventDefault: function() {
  //       }
  //     };
  //     entryForm.handleSubmit(event);
  //
  //     expect(entryForm.connect.mock.calls[0][0])
  //       .toBe('test.com');
  //     expect(entryForm.connect.mock.calls[0][1])
  //       .toBe('50');
  //     expect(entryForm.connect.mock.calls[0][2])
  //       .toBe(undefined);
  //     expect(entryForm.connect.mock.calls[0][3])
  //       .toBe(undefined);
  //   });
  // })
});
