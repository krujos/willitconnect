import PropTypes from 'prop-types';
import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import { PASSED, FAILED, SUBMIT } from './actions/entry-actions';


const getCardVariant = (status) => {
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

const Result = ({ status, header, children, ...props }) => (
  <Card
    bg={getCardVariant(status)}
    text={status === FAILED ? 'light' : undefined}
    className="mb-3"
    {...props}
  >
    {header && <Card.Header>{header}</Card.Header>}
    <Card.Body>
      {status === SUBMIT && <ProgressBar animated now={100} />}
      {children}
    </Card.Body>
  </Card>
);

Result.propTypes = {
  status: PropTypes.string,
  header: PropTypes.node,
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
  success: PropTypes.any,
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
  id: PropTypes.string,
  proxyHost: PropTypes.string,
  proxyPort: PropTypes.string,
  status: PropTypes.string,
  connections: PropTypes.array,
  onSubmit: PropTypes.func,
};
