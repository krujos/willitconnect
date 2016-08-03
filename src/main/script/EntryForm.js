import { Form, FormGroup, ControlLabel, HelpBlock, Col, FormControl, Button, Checkbox, } from 'react-bootstrap';
import React from 'react';

const isValid = (host, port) => {
  if (host) {
    if (host.startsWith('http') || port) {
      return true;
    }
  }
  return false;
};

const InputItem = ({ field, type, onChange }) =>
  <Col xs={5} xsOffset={1} bsSize="large">
    <ControlLabel> {field} </ControlLabel>
    <FormControl
      type={type}
      placeholder={field}
      onChange={e => onChange(e.target.value)}
    />
    <HelpBlock> Scheme is optional </HelpBlock>
  </Col>;

InputItem.propTypes = {
  field: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

const ProxyToggle = ({ enabled, onChange }) =>
  <Checkbox type="checkbox" checked={enabled} onChange={() => onChange(!enabled)} >
    use proxy
  </Checkbox>;

ProxyToggle.propTypes = {
  enabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

const ProxyForm = ({ hostChange, portChange }) =>
  <FormGroup>
    <InputItem field="proxyHost" type="text" onChange={hostChange} />
    <InputItem field="proxyPort" type="number" onChange={portChange} />
  </FormGroup>;

ProxyForm.propTypes = {
  hostChange: React.PropTypes.func.isRequired,
  portChange: React.PropTypes.func.isRequired,
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

    this.props.onSubmit(toEntry({ ...this.props,
      proxyHost: isChecked ? proxyHost : null,
      proxyPort: isChecked ? proxyPort : null,
    }));
  }

  render() {
    return (
      <Form horizontal className="entryForm" onSubmit={this.handleSubmit}>
        <FormGroup>
          <InputItem field="host" type="text" onChange={this.onChangeOf('host')} />
          <InputItem field="port" type="number" onChange={this.onChangeOf('port')} />
        </FormGroup>
        <FormGroup>
          <Col xs={3} xsOffset={1}>
            <ProxyToggle
              enabled={this.state.isChecked}
              onChange={() => this.setState({ isChecked: !this.state.isChecked })}
            />
          </Col>
        </FormGroup>
        {this.state.isChecked &&
          <ProxyForm
            hostChange={this.onChangeOf('proxyHost')}
            portChange={this.onChangeOf('proxyPort')}
          />}
        <FormGroup>
          <Col xs={1} xsOffset={11}>
            <Button type="submit"> Check </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

EntryForm.propTypes = {
  host: React.PropTypes.string,
  port: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  proxyHost: React.PropTypes.string,
  proxyPort: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};
EntryForm.defaultProps = {
  onChange: entry => entry,
  onSubmit: entry => entry,
};
