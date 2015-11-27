var React = require('react');
var ReactDOM = require('react-dom');
var FixedDataTable = require('fixed-data-table');

require('fixed-data-table/dist/fixed-data-table.min.css');
require('expose?$!expose?jQuery!jquery');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

import { Col } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Input } from 'react-bootstrap';
import { ButtonInput } from 'react-bootstrap';

const {Table, Column, Cell} = FixedDataTable;

"use strict";


var HeaderBar = React.createClass ({

    render: function () {
        return (
        <Navbar inverse fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">willitconnect</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem eventKey={1} href="https://github.com/krujos/willitconnect"><span className="mega-octicon octicon-mark-github"></span></NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        );
    }

});

var Entry = React.createClass({
    getInitialState: function () {
        return {status: []};
    },
    componentWillMount: function () {
        var path;
        if (this.props.proxyHost && this.props.proxyPort) {
            path = '/willitconnectproxy?host=' + this.props.host + '&port=' + this.props.port + '&proxyHost=' + this.props.proxyHost + '&proxyPort=' + this.props.proxyPort;
        }
        else {
            path = '/willitconnect?host=' + this.props.host + '&port=' + this.props.port;
        }
        $.get(path, function (status) {
            this.setState({status: status});
        }.bind(this));
    },
    render: function () {

        var connectionStyle = this.state.status.indexOf("cannot") > -1 ? {color: 'red'} : {color: 'green'};

        return (
            <div style={ connectionStyle }>
                <h3 className="entry">
                    {this.props.host} : {this.props.port}
                </h3>
            </div>
        );
    }
});



var EntryBox = React.createClass({
    handleEntrySubmit: function (entry) {
        var entries = this.state.data;
        var newEntries = entries.concat([entry]);
        this.setState({data: newEntries});
    },
    getInitialState: function () {
        return {data: []};
    },
    render: function () {

        var bodyStyle = { 'padding' : 75};

        return (
            <Grid>
                <HeaderBar />
                <Row style={ bodyStyle }>
                        <EntryList data={this.state.data}/>
                        <EntryForm onEntrySubmit={this.handleEntrySubmit}/>
                        <h5> Bound Services </h5>
                        <EntryTable />
                </Row>
            </Grid>
        );
    }
});

var TableCell = React.createClass ({
    render: function() {
        const {rowIndex, field, data, ...props} = this.props;

        var connectionStyle = {color: 'gray'};

        if (data[rowIndex]["validHostname"]) {
            connectionStyle = data[rowIndex]["canConnect"] ? {color: 'green'} : {color: 'red'};
        }

        return (
            <Cell style={ connectionStyle } {...props}>
                {data[rowIndex][field]}
            </Cell>
        );
    }
});

var StatusCell = React.createClass  ({
    render: function() {
        const {rowIndex, field, data, ...props} = this.props;
        const value = data[rowIndex][field];
        return (
            <Cell {...props}>
                { value ? <span className="mega-octicon octicon-thumbsup"></span> : <span className="mega-octicon octicon-thumbsdown"></span> }
            </Cell>
        );
    }
});

var fakeData = [
    {
        "lastChecked": "1444491695787",
        "entry": "172.20.247.12:34424",
        "canConnect": true,
        "validHostname": true
    },
    {
        "lastChecked": 0,
        "entry": "null:-1",
        "canConnect": false,
        "validHostname": false
    },
    {
        "lastChecked": 0,
        "entry": "willitconnect-com.apps-np.homedepot.com:80",
        "canConnect": false,
        "validHostname": false
    },
    {
        "lastChecked": 0,
        "entry": "null:-1",
        "canConnect": false,
        "validHostname": false
    }
];

var EntryTable = React.createClass ({

    loadServiceDataFromServer: function () {
        $.ajax({
            url: '/serviceresults',
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function (services) {
                this.setState({services: services});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {services: []};
    },
    componentDidMount: function () {
        this.loadServiceDataFromServer();
    },

    render: function() {
        return (
                    <Table
                        rowsCount={this.state.services.length}
                        rowHeight={50}
                        headerHeight={50}
                        width={1000}
                        maxHeight={500}>
                        <Column
                            header={<Cell>Entry</Cell>}
                            cell={
                     <TableCell
                        data={this.state.services}
                        field='entry'
                     />
                    }
                            flexGrow={2}
                            width={10}
                        />
                        <Column
                            header={<Cell>Can Connect</Cell>}
                            cell={
                        <StatusCell
                            data={this.state.services}
                            field='canConnect'
                         />
                    }
                            flexGrow={1}
                            width={2}
                        />
                    </Table>
        );
    }
});

var EntryList = React.createClass({
    render: function () {
        var entryNodes = this.props.data.map(function (entry, index) {
            return (
                <Entry host={entry.host} port={entry.port} status={entry.status} proxyHost={entry.proxyHost}
                       proxyPort={entry.proxyPort} key={index}/>
            );
        });
        return (
            <div className="entryList">
                {entryNodes}
            </div>
        );
    }
});

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
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <Row>
                    <Col xs={3} xsOffset={3} bsSize="large">
                        <Input type="text" placeholder="Host" ref="host"/>
                    </Col>
                    <Col xs={3}>
                        <Input type="number" placeholder="Port" ref="port"/>
                    </Col>
                    <Col xs={3}>
                        <ButtonInput type="submit" value="Check"/>
                    </Col>
                </Row>

                <Row>
                    <Col xs={3} xsOffset={3} bsSize="large">
                        <Input type="text" placeholder="Proxy Host (optional)" ref="proxyHost"/>
                    </Col>
                    <Col xs={3}>
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

ReactDOM.render(
    <EntryBox />,
    document.getElementById('content')
);
