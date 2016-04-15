import {Col} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Container} from 'react-bootstrap';
import {Input} from 'react-bootstrap';
import {ButtonInput} from 'react-bootstrap';
import React from 'react';

var EntryForm = React.createClass({

    getInitialState: function () {
        return {isChecked: false};
    },
    onProxyBoxChange: function () {
        this.setState({isChecked: !this.state.isChecked});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var proxyHost;
        var proxyPort;
        var host = this.refs.host.getValue();
        var port = this.refs.port.getValue();

        if (!this.isValid()) {
            mixpanel.track("failed connect attempted", {"type": "invalid form"});
            return;
        }

        if (this.state.isChecked) {
            proxyHost = this.refs.proxyHost.getValue();
            proxyPort = this.refs.proxyPort.getValue();
        }

        this.connect(host, port, proxyHost, proxyPort);
    },
    connect: function (host, port, proxyHost, proxyPort) {
        console.log(host, port, proxyHost, proxyPort);
        this.props.onEntrySubmit({host: host, port: port, proxyHost: proxyHost, proxyPort: proxyPort});
    },
    isValid: function () {
        if (this.refs.host && this.refs.host.getValue()) {
            if (this.refs.host.getValue().startsWith("http") || (this.refs.port && this.refs.port.getValue())) {
                return true;
            }
        }
        return false;
    },
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <Row>
                    <Col xs={5} xsOffset={1} bsSize="large">
                        <Input className="host" label="host" type="text" placeholder="Host" ref="host"
                               help="scheme is optional"/>
                    </Col>
                    <Col xs={5}>
                        <Input className="port" label="port"
                               help="defaults to 80/443 if host has url scheme" type="number"
                               hasFeedback placeholder="Port" ref="port"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} xsOffset={1}>
                        <Input className="proxyBox" type="checkbox" label="Use Proxy" ref="proxyBox"
                               checked={this.state.isChecked} onChange={this.onProxyBoxChange}/>
                    </Col>
                </Row>
                { this.state.isChecked ?
                    <Row>
                        <Col xs={5} xsOffset={1} bsSize="large">
                            <Input className="proxyHost" label="proxyHost" type="text" placeholder="Proxy Host"
                                   ref="proxyHost"/>
                        </Col>
                        <Col xs={5}>
                            <Input className="proxyPort" label="proxyPort" type="number" placeholder="Proxy Port"
                                   ref="proxyPort"/>
                        </Col>
                    </Row> 
                    : null }
                <Row>
                    <Col xs={1} xsOffset={11}>
                        <ButtonInput type="submit" value="Check" className="submitButton"/>
                    </Col>
                </Row>
            </form>
        );
    }
});


module.exports = EntryForm;

