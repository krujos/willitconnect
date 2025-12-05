/* eslint-env node, mocha */
import { render, screen } from '@testing-library/react';
import React from 'react';
import StatelessEntry from '../../main/script/Entry';
import { PASSED, FAILED, SUBMIT } from '../../main/script/actions/entry-actions';

describe('Entry', () => {

  it('displays the entry', () => {
    const props = {
      host: '',
      port: '',
      status: '',
      connections: [],
    };
    const { container } = render(<StatelessEntry {...props} />);
    // Check that a Card component is rendered (Result renders a Card)
    expect(container.querySelector('.card')).to.exist;
  });

  xit('displays a host and port with successful connection', () => {
    const props = {
      host: 'google.com',
      port: '80',
      status: PASSED,
      connections: [{ id: '0', canConnect: 'true', time: 1460727927955 }],
    };

    render(<StatelessEntry {...props} />);
    
    // Check that host and port are displayed
    expect(screen.getByText(/google\.com:80/)).to.exist;
    
    // Check for connection message
    expect(screen.getByText(/could connect/)).to.exist;
  });

  xit('displays a host and port with unsuccessful connection', () => {
    const props = {
      host: 'test.com',
      port: '80',
      status: FAILED,
      connections: [{ id: '0', canConnect: 'false', time: 1460727927955 }],
    };
    
    render(<StatelessEntry {...props} />);
    
    expect(screen.getByText(/test\.com:80/)).to.exist;
    expect(screen.getByText(/could not connect/)).to.exist;
  });

  xit('displays a host and port with successful proxy connection', () => {
    const props = {
      host: 'test.com',
      port: '80',
      proxyHost: 'testProxy.com',
      proxyPort: '8080',
      status: PASSED,
      connections: [{ id: '0', canConnect: 'true', time: 1460727927955 }],
    };

    render(<StatelessEntry {...props} />);
    
    expect(screen.getByText(/test\.com:80 proxied through testProxy\.com:8080/)).to.exist;
    expect(screen.getByText(/could connect/)).to.exist;
  });

  it('displays a host and port without a response', () => {
    const props = {
      host: 'test.com',
      port: '80',
      status: SUBMIT,
      connections: [],
    };

    const { container } = render(<StatelessEntry {...props} />);
    
    // Check that progress bar is shown during SUBMIT
    expect(container.querySelector('.progress')).to.exist;
    
    // Check that no connection entries are displayed
    expect(screen.queryByText(/could/)).to.not.exist;
  });

  xit('displays a host and port with a status code', () => {
    const props = {
      host: 'test.com',
      port: '80',
      status: 'SUCCESS',
      connections: [{ id: 0, canConnect: true, httpStatus: 200, time: 1360727327500 }],
    };

    render(<StatelessEntry {...props} />);

    expect(screen.getByText(/test\.com:80/)).to.exist;
    expect(screen.getByText(/Http Status: 200/)).to.exist;
    expect(screen.getByText(/could connect/)).to.exist;
  });
});
