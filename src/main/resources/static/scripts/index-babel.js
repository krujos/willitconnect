/**
 * Extensive use was made of the fantastic tutorials at https://facebook.github.io/react/index.html
 */

'use strict';

var Entry = React.createClass({
  displayName: 'Entry',

  getInitialState: function getInitialState() {
    return { status: [] };
  },
  componentWillMount: function componentWillMount() {
    var path = '/willitconnect?host=' + this.props.host + '&port=' + this.props.port;
    $.get(path, (function (status) {
      this.setState({ status: status });
    }).bind(this));
  },
  render: function render() {

    //TODO: clean this up
    var redStyle = {
      color: 'red'
    };
    var greenStyle = {
      color: 'green'
    };

    if (this.state.status.indexOf("cannot") > -1) {
      return React.createElement(
        'div',
        { style: redStyle, className: '' },
        React.createElement(
          'h2',
          { className: 'entry' },
          this.props.host,
          ' : ',
          this.props.port
        )
      );
    }
    return React.createElement(
      'div',
      { style: greenStyle, className: '' },
      React.createElement(
        'h3',
        { className: 'entry' },
        this.props.host,
        ' : ',
        this.props.port
      )
    );
  }
});

var EntryBox = React.createClass({
  displayName: 'EntryBox',

  handleEntrySubmit: function handleEntrySubmit(entry) {
    var entries = this.state.data;
    var newEntries = entries.concat([entry]);
    this.setState({ data: newEntries });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'entryBox' },
      React.createElement(
        'h1',
        null,
        'willitconnect'
      ),
      React.createElement(EntryList, { data: this.state.data }),
      React.createElement(EntryForm, { onEntrySubmit: this.handleEntrySubmit })
    );
  }
});

var EntryList = React.createClass({
  displayName: 'EntryList',

  render: function render() {
    var entryNodes = this.props.data.map(function (entry, index) {
      return React.createElement(Entry, { host: entry.host, port: entry.port, status: entry.status, key: index });
    });
    return React.createElement(
      'div',
      { className: 'entryList' },
      entryNodes
    );
  }
});

var EntryForm = React.createClass({
  displayName: 'EntryForm',

  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var host = React.findDOMNode(this.refs.host).value.trim();
    var port = React.findDOMNode(this.refs.port).value.trim();
    if (!port || !host) {
      return;
    }
    this.props.onEntrySubmit({ host: host, port: port });
    React.findDOMNode(this.refs.host).value = '';
    React.findDOMNode(this.refs.port).value = '';
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'entryForm', onSubmit: this.handleSubmit },
      React.createElement('input', { type: 'text', placeholder: 'Host', ref: 'host' }),
      React.createElement('input', { type: 'number', placeholder: 'Port', ref: 'port' }),
      React.createElement('input', { type: 'submit', value: 'Check' })
    );
  }
});

React.render(
//TODO: tie this to the EntryConsumer lists
React.createElement(EntryBox, null), document.getElementById('content'));

