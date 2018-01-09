import PropTypes from 'prop-types';
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
  port: PropTypes.number,
  key: PropTypes.number,
  host: PropTypes.string,
  recheck: PropTypes.func,
  proxyHost: PropTypes.string,
  proxyPort: PropTypes.number,
  onSubmit: PropTypes.func,
  entry: PropTypes.any,
};

const Result = ({ status, children, ...props }) =>
  <Panel bsStyle={getPanelStyle(status)} {...props}>
    {status === SUBMIT && <ProgressBar active now={100} />}
    {children}
  </Panel>;

Result.propTypes = {
  status: PropTypes.string,
  children: PropTypes.any,
};

const Entry = ({
  success,
  httpStatus,
  time,
  responseTime,
}) =>
  <ul>
    <li>  On {time}, I {success ? 'could' : 'could not'} connect. It took {responseTime} ms.
      {httpStatus !== 0 && <span>Http Status: {httpStatus}</span>}
    </li>
  </ul>;

Entry.propTypes = {
  success: PropTypes.string,
  httpStatus: PropTypes.number,
  time: PropTypes.string,
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
          responseTime={attempt.responseTime}
        />
      );
    }).reverse()}
  </Result>);
};
export default StatelessEntry;

StatelessEntry.propTypes = {
  port: PropTypes.string,
  host: PropTypes.string,
  key: PropTypes.string,
  id: PropTypes.string,
  proxyHost: PropTypes.string,
  proxyPort: PropTypes.string,
  status: PropTypes.string,
  connections: PropTypes.array,
  onSubmit: PropTypes.func,
};
// StatelessEntry.defaultProps = {
//   port: '',
//   host: '',
//   connections: [],
// };