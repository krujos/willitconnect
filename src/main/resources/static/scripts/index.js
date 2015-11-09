/**
 * Extensive use was made of the fantastic tutorials at https://facebook.github.io/react/index.html
 */

"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var DataGrid = require('react-datagrid');
require('react-datagrid/index.css');
var $ = require('jquery');

var Entry = React.createClass({
    getInitialState: function () {
        return {status: []};
    },
    componentWillMount: function () {
        var path = '/willitconnect?host=' + this.props.host + '&port=' + this.props.port;
        $.get(path, function (status) {
            this.setState({status: status});
        }.bind(this));
    },
    render: function () {

        var connectionStyle = this.state.status.indexOf("cannot") > -1 ? {color: 'red'} : {color: 'green'};

        return (
            <div style={connectionStyle} className="">
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
            <div className="entryBox">
                <h1>willitconnect</h1>
                <EntryList data={this.state.data}/>
                <EntryForm onEntrySubmit={this.handleEntrySubmit}/>
                <VCapServicesList services={this.state.services}/>
            </div>
        );
    }
});

var EntryList = React.createClass({
    render: function () {
        var entryNodes = this.props.data.map(function (entry, index) {
            return (
                <Entry host={entry.host} port={entry.port} status={entry.status} key={index}/>
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
        this.props.onEntrySubmit({host: host, port: port});
        ReactDOM.findDOMNode(this.refs.host).value = '';
        ReactDOM.findDOMNode(this.refs.port).value = '';
    },
    render: function () {
        return (
            <form className="entryForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Host" ref="host"/>
                <input type="number" placeholder="Port" ref="port"/>
                <input type="submit" value="Check"/>
            </form>
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

var columns = [
    {name: 'entry'},
    {
        name: 'canConnect', render: function (value) {
        if (value) {
            return "Yes";
        }
        return "No";
    }
    }
];

function rowStyle(data, props) {

    if (data.canConnect) {
        return { color: 'green' };
    }

    return data.validHostname ? { color: 'red' } : { color: 'gray' };
}

var VCapServicesList = React.createClass({
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
        //setInterval(this.loadServiceDataFromServer, 2000);
    },
    render: function () {
        return (
            <div className="ServicesList">
                <h4> Bound services: </h4>
                <DataGrid
                    idProperty='dataGrid'
                    //dataSource={this.state.services}
                    dataSource={fakeData}
                    columns={columns}
                    style={{height: 200}}
                    withColumnMenu={false}
                    rowStyle={rowStyle}
                    emptyText={'Validate your service bindings'}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <EntryBox />,
    document.getElementById('content')
);
