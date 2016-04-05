import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Input } from 'react-bootstrap';
import { ButtonInput } from 'react-bootstrap';
import React from 'react';

var EntryForm = React.createClass({

    getInitialState: function () {
        return {isChecked: false};
    },
    onChange: function () {
        this.setState({isChecked: !this.state.isChecked});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var proxyHost;
        var proxyPort;
        var host = this.refs.host.getValue();
        var port = this.refs.port.getValue();
        
        if (!this.isValid()) {
            mixpanel.track("connect attempted with invalid form");
            return;
        }

        if(this.state.isChecked) {
            proxyHost = this.refs.proxyHost.getValue();
            proxyPort = this.refs.proxyPort.getValue();
        }

        this.connect(host, port, proxyHost, proxyPort);
    },
    connect: function(host, port, proxyHost, proxyPort) {
        console.log(host, port, proxyHost, proxyPort);
        this.props.onEntrySubmit({host: host, port: port, proxyHost: proxyHost, proxyPort: proxyPort});
    },
    isValid: function() {
        if (this.refs.host && this.refs.host.getValue()) {
            if(!this.isPortRequired() || (this.refs.port && this.refs.port.getValue())) {
                return true;
            }
        }
        return false;
    },
    isPortRequired: function() {
        var host = this.refs.host;
        if(host) {
            if(host.getValue().startsWith("http")) {
                return false;
            }
        }
        return true;
    },
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <Row>
                    <Col xs={4} xsOffset={1} bsSize="large">
                        <Input className="host" type="text" placeholder="Host" ref="host"/>
                    </Col>
                    <Col xs={4}>
                        <Input className="port" type="number" placeholder="Port" ref="port" required={this.isPortRequired()}/>
                    </Col>
                    <Col xs={3}>
                        <ButtonInput type="submit" value="Check" className="submitButton"/>
                    </Col>
                </Row>

                <Row>
                    <Col  xs={4} xsOffset={1} bsSize="large">
                        <Input className="proxyPort" type="text" placeholder="Proxy Host (optional)" ref="proxyHost"/>
                    </Col>
                    <Col xs={4}>
                        <Input className="proxyHost" type="number" placeholder="Proxy Port (optional)" ref="proxyPort"/>
                    </Col>
                    <Col xs={3}>
                        <Input className="proxyBox" type="checkbox" label="Use Proxy" ref="proxyBox" checked={this.state.isChecked} onChange={this.onChange} />
                    </Col>
                </Row>
            </form>
        );
    }
});

module.exports = EntryForm;

