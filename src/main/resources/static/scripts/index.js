/**
 * Extensive use was made of the fantastic tutorials at https://facebook.github.io/react/index.html
 */
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

const {Table, Column, Cell} = FixedDataTable;

/* https://github.com/facebook/fixed-data-table/blob/master/examples/ObjectDataExample.js */
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
        return (
            <Grid>
                <HeaderBar />
                <Row>
                    <Col xs={6} md={4} xsOffset={3} mdOffset={4}>
                        <EntryList data={this.state.data}/>
                        <EntryForm onEntrySubmit={this.handleEntrySubmit}/>
                        <EntryTable />
                    </Col>
                </Row>
            </Grid>
        );
    }
});

var TableCell = React.createClass ({
    render: function() {
        const {rowIndex, field, data, ...props} = this.props;
        return (
            <Cell {...props}>
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
                { value ? 'Yes' : 'No' }
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
                        rowsCount={fakeData.length}
                        rowHeight={50}
                        headerHeight={50}
                        width={1000}
                        maxHeight={500}>
                        <Column
                            header={<Cell>Entry</Cell>}
                            cell={
                     <TableCell
                        data={fakeData}
                        field='entry'
                     />
                    }
                            flexGrow={2}
                            width={75}
                        />
                        <Column
                            header={<Cell>Can Connect</Cell>}
                            cell={
                        <StatusCell
                            data={fakeData}
                             field='canConnect'
                         />
                    }
                            flexGrow={1}
                            width={25}
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
        var host = ReactDOM.findDOMNode(this.refs.host).value.trim();
        var port = ReactDOM.findDOMNode(this.refs.port).value.trim();

        if (!port || !host) {
            return;
        }

        var proxyHost = ReactDOM.findDOMNode(this.refs.proxyHost).value.trim();
        var proxyPort = ReactDOM.findDOMNode(this.refs.proxyPort).value.trim();

        this.props.onEntrySubmit({host: host, port: port, proxyHost: proxyHost, proxyPort: proxyPort});
        ReactDOM.findDOMNode(this.refs.host).value = '';
        ReactDOM.findDOMNode(this.refs.port).value = '';
    },
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Host" ref="host"/>
                <input type="number" placeholder="Port" ref="port"/>
                <div></div>
                <input type="text" placeholder="Proxy Host (optional)" ref="proxyHost"/>
                <input type="number" placeholder="Proxy Port (optional)" ref="proxyPort"/>
                <input type="submit" value="Check"/>
            </form>
        );
    }
});

function rowStyle(data, props) {

    if (data.canConnect) {
        return {color: 'green'};
    }

    return data.validHostname ? {color: 'red'} : {color: 'gray'};
}



ReactDOM.render(
    <EntryBox />,
    document.getElementById('content')
);
