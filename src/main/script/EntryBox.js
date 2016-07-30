import HeaderBar from './HeaderBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import React from 'react';

import { Grid, Row } from 'react-bootstrap';

export default class EntryBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.handleEntrySubmit = this.handleEntrySubmit.bind(this);
  }

  handleEntrySubmit(entry) {
    const entries = this.state.data;
    const newEntries = entries.concat(entry);
    this.setState({ data: newEntries });
  }

  render() {
    mixpanel.track('page loaded');
    let bodyStyle = { padding: 75 };
    return (
      <Grid>
        <HeaderBar />
        <Row style={bodyStyle}>
          <EntryForm onEntrySubmit={this.handleEntrySubmit} />
          <EntryList data={this.state.data} />
        </Row>
      </Grid>
    );
  }
}
