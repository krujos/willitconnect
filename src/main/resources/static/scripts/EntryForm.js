import { Col } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Input } from 'react-bootstrap';
import { ButtonInput } from 'react-bootstrap';
import React from 'react';

var EntryForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var host = this.refs.host.getValue();
        var port = this.refs.port.getValue();


        if (!port || !host) {
            return;
        }

        var proxyHost = this.refs.proxyHost.getValue();
        var proxyPort = this.refs.proxyPort.getValue();

        this.props.onEntrySubmit({host: host, port: port, proxyHost: proxyHost, proxyPort: proxyPort});
    },
    isPortRequired: function() {
      return true;  
    },
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <Row>
                    <Col xs={4} xsOffset={1} bsSize="large">
                        <Input type="text" placeholder="Host" ref="host"/>
                    </Col>
                    <Col xs={4}>
                        <Input type="number" placeholder="Port" ref="port" required={this.isPortRequired()}/>
                    </Col>
                    <Col xs={3}>
                        <ButtonInput type="submit" value="Check"/>
                    </Col>
                </Row>

                <Row>
                    <Col  xs={4} xsOffset={1} bsSize="large">
                        <Input type="text" placeholder="Proxy Host (optional)" ref="proxyHost"/>
                    </Col>
                    <Col xs={4}>
                        <Input type="number" placeholder="Proxy Port (optional)" ref="proxyPort"/>
                    </Col>
                    <Col xs={3}>
                        <Input type="checkbox" label="Use Proxy" ref="proxyBox" />
                    </Col>
                </Row>
            </form>
        );
    }
});

module.exports = EntryForm;

