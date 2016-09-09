import React from 'react';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';
import { PASSED, FAILED, SUBMIT } from './actions/entry-actions';


const getPanelStyle = (status) => {
  switch (status) {
    case PASSED:
      return 'success';
    case FAILED:
      return 'danger';
    default:
      return 'info';
  }
};

const resultHeader = (props) => {
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
        <button onClick={() => props.recheck(props)}>Re-check</button>
      </span>
    </div>
  );
};

resultHeader.propTypes = {
  port: React.PropTypes.number,
  key: React.PropTypes.number,
  host: React.PropTypes.string,
  recheck: React.PropTypes.func,
  proxyHost: React.PropTypes.string,
  proxyPort: React.PropTypes.number,
  onSubmit: React.PropTypes.func,
  entry: React.PropTypes.any,
};

const Result = ({ status, children, ...props }) =>
  <Panel bsStyle={getPanelStyle(status)} {...props}>
    {status === SUBMIT && <ProgressBar active now={100} />}
    {children}
  </Panel>;

Result.propTypes = {
  status: React.PropTypes.string,
  children: React.PropTypes.any,
};

const Entry = ({
  success,
  httpStatus,
  time,
}) =>
  <ul>
    <li>  On {time}, I {success ? 'could' : 'could not'} connect.
      {httpStatus !== 0 && <span>Http Status: {httpStatus}</span>}
    </li>
  </ul>;

Entry.propTypes = {
  success: React.PropTypes.string,
  httpStatus: React.PropTypes.number,
  time: React.PropTypes.string,
};

const StatelessEntry = (props) => {
  const subProps = {
    key: props.id,
    host: props.host,
    port: props.port,
    proxyHost: props.proxyHost,
    proxyPort: props.proxyPort,
    recheck: props.onSubmit,
  };
  return (<Result header={resultHeader(subProps)} status={props.status} >
    {props.connections.map((attempt) => {
      return (
        <Entry
          key={attempt.id}
          success={attempt.canConnect}
          httpStatus={attempt.httpStatus}
          time={(new Date(attempt.time)).toLocaleString()}
        />
      );
    }).reverse()}
  </Result>);
};
export default StatelessEntry;

StatelessEntry.propTypes = {
  port: React.PropTypes.string,
  host: React.PropTypes.string,
  key: React.PropTypes.string,
  id: React.PropTypes.string,
  proxyHost: React.PropTypes.string,
  proxyPort: React.PropTypes.string,
  status: React.PropTypes.string,
  connections: React.PropTypes.array,
  onSubmit: React.PropTypes.func,
};
// StatelessEntry.defaultProps = {
//   port: '',
//   host: '',
//   connections: [],
// };
