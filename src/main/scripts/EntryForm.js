import {Form, FormGroup, ControlLabel, HelpBlock, Col, FormControl, Button, Checkbox} from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

export default class EntryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        this.onProxyBoxChange = this.onProxyBoxChange.bind(this);
        this.connect = this.connect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onProxyBoxChange() {
        this.setState({isChecked: !this.state.isChecked});
    }
    handleSubmit(e){
        e.preventDefault();
        var proxyHost;
        var proxyPort;
        var host = ReactDOM.findDOMNode(this.refs.host).value;
        var port = ReactDOM.findDOMNode(this.refs.port).value;

        if (!this.isValid(host, port)) {
            mixpanel.track("failed connect attempted", {"type": "invalid form"});
            return;
        }

        if (this.state.isChecked) {
            proxyHost = this.refs.proxyHost.getValue();
            proxyPort = this.refs.proxyPort.getValue();
        }

        this.connect(host, port, proxyHost, proxyPort);
    }
    connect(host, port, proxyHost, proxyPort) {
        this.props.onEntrySubmit({host: host, port: port, proxyHost: proxyHost, proxyPort: proxyPort});
    }
    isValid(host, port) {
        if (host) {
            if (host.startsWith("http") || port) {
                return true;
            }
        }
        return false;
    }
    render() {
        return (
            <Form horizontal className="entryForm" onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Col xs={5} xsOffset={1} bsSize="large">
                        <ControlLabel> host </ControlLabel>
                        <FormControl controlId="host" type="text" placeholder="Host" ref="host" />
                        <HelpBlock> Scheme is optional </HelpBlock>
                    </Col>
                    <Col xs={5}>
                        <ControlLabel> port </ControlLabel>
                        <FormControl className="port" type="number" placeholder="Port" ref="port"/>
                        <HelpBlock> defaults to 80/443 if host has url scheme </HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col xs={3} xsOffset={1}>
                        <Checkbox className="proxyBox" type="checkbox" ref="proxyBox"
                               checked={this.state.isChecked} onChange={this.onProxyBoxChange}> use proxy 
                        </Checkbox>
                    </Col>
                </FormGroup>
                { this.state.isChecked ?
                    <FormGroup>
                        <Col xs={5} xsOffset={1} bsSize="large">
                            <ControlLabel> proxy host </ControlLabel>
                            <FormControl className="proxyHost" label="proxyHost" type="text" placeholder="Proxy Host"
                                   ref="proxyHost"/>
                        </Col>
                        <Col xs={5}>
                            <ControlLabel> proxy port </ControlLabel>
                            <FormControl className="proxyPort" label="proxyPort" type="number" placeholder="Proxy Port"
                                   ref="proxyPort"/>
                        </Col>
                    </FormGroup>
                    : null }
                <FormGroup>
                    <Col xs={1} xsOffset={11}>
                        <Button type="submit"> Check </Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
};

