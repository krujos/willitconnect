/* eslint-env node, mocha, browser */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import EntryForm from '../../main/script/EntryForm';

describe('EntryForm', () => {
  const mixpanel = { track: () => {} };

  beforeEach(function() {
    window.mixpanel = mixpanel;
  });

  it('displays the form', () => {
    const { container } = render(<EntryForm />);
    expect(container.querySelector('form')).to.exist;
  });

  describe('a valid host and port are provided', () => {
    it('should submit the host and port', () => {
      const onSubmit = sinon.spy();
      render(<EntryForm host="http://script.com" port="80" onSubmit={onSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /Check/i });
      fireEvent.click(submitButton);
      
      expect(onSubmit.calledOnce).to.equal(true);
      expect(onSubmit.calledWith({
        host: 'http://script.com',
        port: '80',
        proxyHost: null,
        proxyPort: null
      })).to.equal(true);
    });

    it('should populate the entry from props', () => {
      render(<EntryForm host="script.com" port="80" />);
      const hostField = screen.getByDisplayValue('script.com');
      const portField = screen.getByDisplayValue('80');
      expect(hostField).to.exist;
      expect(portField).to.exist;
    });
  });

  describe('when the port is omitted', () => {
    it('defaults the submission port to 80', () => {
      const onSubmit = sinon.spy();
      render(<EntryForm host="script.com" port="" onSubmit={onSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /Check/i });
      fireEvent.click(submitButton);
      
      expect(onSubmit.calledOnce).to.equal(true);
      expect(onSubmit.calledWith({
        host: 'script.com',
        port: '80',
        proxyHost: null,
        proxyPort: null,
      })).to.equal(true);
    });

    it('splits host values that include a port', () => {
      const onSubmit = sinon.spy();
      render(<EntryForm host="script.com:9000" port="" onSubmit={onSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /Check/i });
      fireEvent.click(submitButton);
      
      expect(onSubmit.calledOnce).to.equal(true);
      expect(onSubmit.calledWith({
        host: 'script.com',
        port: '9000',
        proxyHost: null,
        proxyPort: null,
      })).to.equal(true);
    });
  });

  context('when a proxy is provided', () => {
    xit('should submit the host and port and proxy', () => {
      const onSubmit = sinon.spy();
      render(<EntryForm host="http://script.com" port="80" proxyHost="www.com" proxyPort="8080" onSubmit={onSubmit} />);
      
      const toggle = screen.getByLabelText(/use proxy/i);
      fireEvent.click(toggle);
      
      const submitButton = screen.getByRole('button', { name: /Check/i });
      fireEvent.click(submitButton);

      expect(toggle.checked).to.eq(true);

      expect(onSubmit.calledOnce).to.equal(true);
      expect(onSubmit.calledWith({
        host: 'http://script.com',
        port: '80',
        proxyHost: 'www.com',
        proxyPort: '8080',
      })).to.equal(true);
    });

    it('should populate the entry from props', () => {
      render(<EntryForm host="http://script.com" port="80" proxyHost="www.com" proxyPort="8080" />);
      
      const toggle = screen.getByLabelText(/use proxy/i);
      fireEvent.click(toggle);
      
      const proxyHostField = screen.getByDisplayValue('www.com');
      const proxyPortField = screen.getByDisplayValue('8080');
      expect(proxyHostField).to.exist;
      expect(proxyPortField).to.exist;
    });

  });
});
