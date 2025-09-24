import { Form, FormGroup, ControlLabel, HelpBlock, Col, FormControl, Button, Checkbox, } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

const URL_WITH_SCHEME = /^http[s]?:[/][/]/i;
const HOST_WITH_OPTIONAL_PORT = /^([\w.-]+)(?::(\d+))?$/;

const hasPortValue = port => port !== undefined && port !== null && `${port}` !== '';

const isValid = (host, port) => {
  if (!host) {
    return false;
  }
  if (URL_WITH_SCHEME.test(host)) {
    return true;
  }
  if (HOST_WITH_OPTIONAL_PORT.test(host)) {
    return true;
  }
  if (hasPortValue(port) && HOST_WITH_OPTIONAL_PORT.test(`${host}:${port}`)) {
    return true;
  }
  return false;
};

//    <HelpBlock> Scheme is optional </HelpBlock>
const InputItem = ({ field, type, onChange, placeholder, value }) =>
  <Col xs={5} xsOffset={1} bsSize="large">
    <ControlLabel> {placeholder} </ControlLabel>
    <input
      className="form-control"
      type={type}
      name={field}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      value={value}
    />
  </Col>;

InputItem.propTypes = {
  field: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
InputItem.defaultProps = {
  onChange: () => {},
  value: '',
};

const ProxyToggle = ({ enabled, onChange }) =>
  <Checkbox type="checkbox" checked={enabled} onChange={() => onChange(!enabled)} >
    use proxy
  </Checkbox>;

ProxyToggle.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const toEntry = ({ host, port, proxyHost, proxyPort }) => ({
  host, port, proxyHost, proxyPort,
});

export default class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isChecked: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeOf(field) {
    return value => this.props.onChange(toEntry({
      ...this.props,
      [field]: value,
    }));
  }

  handleSubmit(e) {
    e.preventDefault();

    const { host, port } = this.props;

    if (!isValid(host, port)) {
      mixpanel.track('failed connect attempted', { type: 'invalid form' });
      return;
    }

    const { proxyHost, proxyPort } = this.props;
    const { isChecked } = this.state;

    const useProxy = isChecked && proxyHost && proxyPort;
    const hasScheme = URL_WITH_SCHEME.test(host);
    const hostMatch = hasScheme ? null : HOST_WITH_OPTIONAL_PORT.exec(host || '');
    let normalizedHost = host;
    let normalizedPort = hasPortValue(port) ? `${port}` : null;

    if (!hasScheme && hostMatch) {
      normalizedHost = hostMatch[1];
      if (hostMatch[2]) {
        normalizedPort = hostMatch[2];
      } else if (!normalizedPort) {
        normalizedPort = '80';
      }
    } else if (!hasScheme && !normalizedPort) {
      normalizedPort = '80';
    }

    this.props.onSubmit(toEntry({ ...this.props,
      host: normalizedHost,
      port: normalizedPort,
      proxyHost: useProxy ? proxyHost : null,
      proxyPort: useProxy ? proxyPort : null,
    }));
  }

  render() {
    return (
      <Form horizontal className="entryForm" onSubmit={this.handleSubmit}>
            <HostPortForm host={this.props.host} port={this.props.port} onHostChange={this.onChangeOf('host')} onPortChange={this.onChangeOf('port')} />
        <FormGroup>
          <Col xs={3} xsOffset={1}>
            <ProxyToggle
              enabled={this.state.isChecked}
              onChange={() => this.setState({ isChecked: !this.state.isChecked })}
            />
          </Col>
        </FormGroup>
        {this.state.isChecked &&
        <HostPortForm host={this.props.proxyHost} port={this.props.proxyPort} hostField="proxyHost" portField="proxyPort"
                      onHostChange={this.onChangeOf('proxyHost')} onPortChange={this.onChangeOf('proxyPort')} />
        }
        <FormGroup>
          <Col xs={1} xsOffset={11}>
            <Button type="submit"> Check </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
const HostPortForm = ( { host, port, hostField = "host", portField = "port", onHostChange, onPortChange } ) =>
  <FormGroup>
    <InputItem field={hostField} placeholder="Host" type="text" value={host} onChange={onHostChange} />
    <InputItem field={portField} placeholder="Port" type="number" value={port} onChange={onPortChange} />
  </FormGroup>;




EntryForm.propTypes = {
  host: PropTypes.string,
  port: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  proxyHost: PropTypes.string,
  proxyPort: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
EntryForm.defaultProps = {
  onChange: entry => entry,
  onSubmit: entry => entry,
};