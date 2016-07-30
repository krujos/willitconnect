import React from 'react';
import jQuery from 'jquery';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';


const getPanelStyle = (pending, success) => {
  if (success) {
    return 'success';
  }
  if (pending) {
    return 'info';
  }
  return 'danger';
};

export const resultHeader = (props) => {
  let resultString = props.host;
  if (props.port) {
    resultString += `:${props.port}`;
  }
  if (props.proxyHost) {
    resultString += ` proxied through ${props.proxyHost}`;
  }
  if (props.proxyPort) {
    resultString += `:${props.proxyPort}`;
  }

  const rightStyle = {
    float: 'right',
  };

  return (
    <div>
      {resultString}
      <span style={rightStyle}>
        <button onClick={props.recheck}>Re-check</button>
      </span>
    </div>
  );
};

resultHeader.propTypes = {
  port: React.PropTypes.number.isRequired,
  host: React.PropTypes.string.isRequired,
  recheck: React.PropTypes.func.isRequired,
  proxyHost: React.PropTypes.string,
  proxyPort: React.PropTypes.number,
};

export const Result = ({ success, pending, children, ...props }) =>
  <Panel bsStyle={getPanelStyle(pending, success)} {...props}>
    {pending && < ProgressBar active now={100} />}
    {children}
  </Panel>;

Result.propTypes = {
  success: React.PropTypes.bool,
  pending: React.PropTypes.bool,
  children: React.PropTypes.object,
};


export const Entry = ({
  success,
  httpStatus,
  time,
}) =>
  <ul>
    <li>On {time}, I {success ? 'could' : 'could not'} connect.
      {httpStatus !== 0 && <span>Http Status: {httpStatus}</span>}
    </li>
  </ul>;

Entry.propTypes = {
  success: React.PropTypes.bool.isRequired,
  httpStatus: React.PropTypes.number,
  time: React.PropTypes.string.isRequired,
};

export default class StatefulEntry extends React.Component {
  constructor(props) {
    super(props);
    this.getLastChecked = this.getLastChecked.bind(this);
    this.getData = this.getData.bind(this);
    this.performCheck = this.performCheck.bind(this);
    this.successFunc = this.successFunc.bind(this);
    this.state = {
      status: null,
      connections: [],
    };
  }
  componentDidMount() {
    this.performCheck();
  }
  getLastChecked(lastChecked) {
    const utcSeconds = parseInt(lastChecked);
    const date = new Date(utcSeconds);
    const month = date.getMonth();
    const day = date.getDay();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`;
    const seconds = `0${date.getSeconds()}`;
    return (`${month}-${day}-${year} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`);
  }
  getData() {
    if (this.props.proxyHost && this.props.proxyPort) {
      return JSON.stringify({
        target: `${this.props.host}:${this.props.port}`,
        http_proxy: `${this.props.proxyHost}:${this.props.proxyPort}`,
      });
    }
    return JSON.stringify({ target: `${this.props.host}:${this.props.port}` });
  }

  successFunc(data) {
    mixpanel.track('connection attempted', {
      canConnect: data.canConnect,
      httpStatus: data.httpStatus,
      validHostName: data.validHostName,
      validUrl: data.validUrl,
    });
    // Build a connections attempt object to store history
    const history = {
      guid: this.state.connections.length,
      success: data.canConnect,
      httpStatus: data.httpStatus,
      time: data.lastChecked,
    };

    // console.log("data", data);

    const newConnections = this.state.connections.concat([history]);

    this.setState({
      status: data,
      connections: newConnections,
    });
    // console.log("state", this.state);
  }
  performCheck() {
    // Set the state to pending
    this.setState({
      status: null,
    });
    const path = '/v2/willitconnect';
    // console.log(this.props.host);
    jQuery.ajax({
      url: path,
      type: 'POST',
      cache: false,
      data: this.getData(),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: this.successFunc,
    });
  }

  render() {
    const pending = (this.state == null || this.state.status == null);
    const success = !pending && this.state.status.canConnect;
    // Build a list of all the historical connection attempts
    // console.table(this.state.connections);
    const attempts = this.state.connections.map(attempt => {
      // console.log("creating attempt", attempt);
      return (
        <Entry
          key={attempt.guid}
          success={attempt.success}
          httpStatus={attempt.httpStatus}
          time={this.getLastChecked(attempt.time)}
        />
      );
    }).reverse();
    const subProps = {
      host: this.props.host,
      port: this.props.port,
      proxyHost: this.props.proxyHost,
      proxyPort: this.props.proxyPort,
      recheck: this.performCheck,
    };
    return (<Result header={resultHeader(subProps)} pending={pending} success={success}>
      <div>{attempts}</div>
    </Result>);
  }
}

StatefulEntry.propTypes = {
  port: React.PropTypes.number.isRequired,
  host: React.PropTypes.string.isRequired,
  proxyHost: React.PropTypes.string,
  proxyPort: React.PropTypes.number,
};



