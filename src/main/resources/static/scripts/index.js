/**
 * Extensive use was made of the fantastic tutorials at https://facebook.github.io/react/index.html
 */
var React = require('react');
var ReactDOM = require('react-dom');
var Griddle = require('griddle-react');
var $ = require('jquery');

var Entry = React.createClass({
  getInitialState: function() {
    return {status: []};
  },
  componentWillMount: function() {
    var path = '/willitconnect?host=' + this.props.host + '&port=' + this.props.port;
    $.get(path, function(status) {
          this.setState({status: status});
      }.bind(this));
   },
  render: function() {

    //TODO: clean this up
    var redStyle = {
        color: 'red',
        };
    var greenStyle = {
        color: 'green',
      };

    if(this.state.status.indexOf("cannot") > -1)
    {
        return (
          <div style={redStyle} className="">
            <h3 className="entry">
                {this.props.host} : {this.props.port}
            </h3>
          </div>
        );
    }
    return (
        <div style={greenStyle} className="">
          <h3 className="entry">
            {this.props.host} : {this.props.port}
            </h3>
        </div>
    );
  }
});

var EntryBox = React.createClass({
  handleEntrySubmit: function(entry) {
    var entries = this.state.data;
    var newEntries = entries.concat([entry]);
    this.setState({data: newEntries});
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="entryBox">
        <h1>willitconnect</h1>
        <EntryList data={this.state.data} />
        <EntryForm onEntrySubmit={this.handleEntrySubmit} />
        <VCapServicesList services={this.state.services} />
      </div>
    );
  }
});

var EntryList = React.createClass({
  render: function() {
    var entryNodes = this.props.data.map(function(entry, index) {
      return (
        <Entry host={entry.host} port={entry.port} status={entry.status} key={index} />
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
  handleSubmit: function(e) {
    e.preventDefault();
    var host = React.findDOMNode(this.refs.host).value.trim();
    var port = React.findDOMNode(this.refs.port).value.trim();
    if (!port || !host) {
      return;
    }
    this.props.onEntrySubmit({host: host, port: port});
    React.findDOMNode(this.refs.host).value = '';
    React.findDOMNode(this.refs.port).value = '';
  },
  render: function() {
    return (
      <form className="entryForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Host" ref="host" />
        <input type="number" placeholder="Port" ref="port" />
        <input type="submit" value="Check" />
      </form>
    );
  }
});

var VCapServicesList = React.createClass({
  loadServiceDataFromServer: function() {
    $.ajax({
      url: '/serviceresults',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(services) {
        console.log('services are' + services);
        this.setState({services: services});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {services: []};
  },
  componentDidMount: function() {
    this.loadServiceDataFromServer();
    //setInterval(this.loadServiceDataFromServer, 2000);
  },
  render: function() {
    return (
      //TODO: loop through list
      //  <div><pre>{JSON.stringify(this.state.services, null, 2) }</pre></div>
      <div className="ServicesList">
      <h4> Bound services: </h4>
        <Griddle results={this.state.services} tableClassName="table" showFilter={false} showSettings={false}
        resultsPerPage={5} enableInfiniteScroll={true} useFixedHeader={true}
        columns={["entry", "canConnect", "lastChecked"]} noDataMessage={"Please validate your service bindings"}/>
      </div>
    );
  }
});

ReactDOM.render(
  //TODO: tie this to the EntryConsumer lists
  <EntryBox />,
  document.getElementById('content')
);
