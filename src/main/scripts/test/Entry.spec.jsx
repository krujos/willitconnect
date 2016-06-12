'use strict';

import React from 'react';
import StatefulEntry from '../Entry';
import { shallow, mount} from 'enzyme';

describe('Entry', () => {
    
    //var server;

    // var mixpanel = {
    //     track: function() {}
    // };
    //
    // beforeEach(function() {
    //     //server = sinon.fakeServer.create();
    //     window.mixpanel = mixpanel;
    // });

    it("displays the entry", function() {
        const entry = shallow(<StatefulEntry />);
        //console.log(entry.debug());
        expect(entry.is('Result')).to.equal(true);
    });

    it("displays a host and port with successful connection", function() {
        const props = {
            host: "google.com",
            port: "80"
        };
        
        const stateEntry = mount(<StatefulEntry {...props} />);
        stateEntry.setState({status: {"canConnect": true, "lastChecked": 1460727927955} });
        
        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal("google.com:80");
        expect(result.prop('pending')).to.equal(false);
        expect(result.prop('success')).to.equal(true);
        
        const entry = stateEntry.find('Entry');
        expect(entry.prop('success')).to.equal(true);
        expect(entry.prop('httpStatus')).to.equal(undefined);
        expect(entry.prop('time')).to.match(/3-5-2016/);
    });

    it("displays a host and port with unsuccessful connection", function() {
        const props = {
            host: "test.com",
            port: "80"
        };

        const stateEntry = mount(<StatefulEntry {...props} />);
        stateEntry.setState({status: {"canConnect": false, "lastChecked": 1460727927955} });

        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal("test.com:80");
        expect(result.prop('pending')).to.equal(false);
        expect(result.prop('success')).to.equal(false);

        const entry = stateEntry.find('Entry');
        expect(entry.prop('success')).to.equal(false);
        expect(entry.prop('httpStatus')).to.equal(undefined);
        expect(entry.prop('time')).to.match(/3-5-2016/);
    });

    it("displays a host and port with successful proxy connection", function() {
        const props = {
            host: "test.com",
            port: "80",
            proxyHost: "testProxy.com",
            proxyPort: "8080"
        };

        const stateEntry = mount(<StatefulEntry {...props} />);
        stateEntry.setState({status: {"canConnect": true, "lastChecked": 1460727927955} });

        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal('test.com:80 proxied through testProxy.com:8080');
        expect(result.prop('pending')).to.equal(false);
        expect(result.prop('success')).to.equal(true);

        const entry = stateEntry.find('Entry');
        expect(entry.prop('success')).to.equal(true);
        expect(entry.prop('httpStatus')).to.equal(undefined);
        expect(entry.prop('time')).to.match(/3-5-2016/);
    });

    it("displays a host and port with unsuccessful proxy connection", function() {
        const props = {
            host: "test.com",
            port: "80",
            proxyHost: "testProxy.com",
            proxyPort: "8081"
        };

        const stateEntry = mount(<StatefulEntry {...props} />);
        stateEntry.setState({status: {"canConnect": false, "lastChecked": 1460727927955} });

        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal('test.com:80 proxied through testProxy.com:8081');
        expect(result.prop('pending')).to.equal(false);
        expect(result.prop('success')).to.equal(false);

        const entry = stateEntry.find('Entry');
        expect(entry.prop('success')).to.equal(false);
        expect(entry.prop('httpStatus')).to.equal(undefined);
        expect(entry.prop('time')).to.match(/3-5-2016/);
    });

    it("displays a host and port without a response", function() {
        const props = {
            host: "test.com",
            port: "80"
        };

        const stateEntry = mount(<StatefulEntry {...props} />);
        
        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal('test.com:80');
        expect(result.prop('pending')).to.equal(true);
        expect(result.prop('success')).to.equal(false);

        expect(stateEntry.contains('Entry')).to.equal(false);
    });

    it("displays a host and port with a status code", function() {
        const props = {
            host: "test.com",
            port: "80"
        };

        const stateEntry = mount(<StatefulEntry {...props} />);
        stateEntry.setState({status: {"canConnect": true, "httpStatus": "200", "lastChecked": 1360727327500} });

        const result = stateEntry.find('Result');
        expect(result.prop('header')).to.equal('test.com:80');
        expect(result.prop('pending')).to.equal(false);
        expect(result.prop('success')).to.equal(true);

        const entry = stateEntry.find('Entry');
        expect(entry.prop('success')).to.equal(true);
        expect(entry.prop('httpStatus')).to.equal('200');
        expect(entry.prop('time')).to.match(/1-/);
    });
});
