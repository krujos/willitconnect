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
  <Checkbox type="checkbox" checked={enabled} onChange={e => onChange(!enabled)} >
    use proxy
  </Checkbox>;

ProxyToggle.propTypes = {
  enabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

const ProxyForm = ({ onChange }) =>
  <FormGroup>
    <InputItem field="proxyHost" type="text" onChange={onChange} />
    <InputItem field="proxyPort" type="number" onChange={onChange} />
  </FormGroup>;

ProxyForm.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};


export default class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { isChecked: false };
    this.state = {
      isChecked: false,
      proxyHost: 'str-www-proxy2.homedepot.com',
      proxyPort: 8080,
      host: 'google.com',
      port: 80,
    };
    this.connect = this.connect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeOf(field) {
    return value => this.setState({ [field]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { host, port } = this.state;

    if (!isValid(host, port)) {
      mixpanel.track('failed connect attempted', {type: 'invalid form'});
      return;
    }

    let { proxyHost, proxyPort } = this.state;
    const { isChecked } = this.state;
    if (!isChecked) {
      proxyHost = null;
      proxyPort = null;
    }

    this.connect(host, port, proxyHost, proxyPort);
  }

  connect(host, port, proxyHost, proxyPort) {
    this.props.onEntrySubmit({ host, port, proxyHost, proxyPort });
  }

  render() {
    return (
      <Form horizontal className="entryForm" onSubmit={this.handleSubmit}>
        <FormGroup>
          <InputItem field="host" type="text" onChange={this.onChangeOf} />
          <InputItem field="port" type="number" onChange={this.onChangeOf} />
        </FormGroup>
        <FormGroup>
          <Col xs={3} xsOffset={1}>
            <ProxyToggle enabled={this.state.isChecked} onChange={this.onChangeOf('isChecked')} />
          </Col>
        </FormGroup>
        {this.state.isChecked && <ProxyForm onChange={this.onChangeOf} />}
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
  onEntrySubmit: React.PropTypes.func.isRequired,
};
