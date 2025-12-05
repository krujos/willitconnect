import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Container, Row } from 'react-bootstrap';
import HeaderBar from './HeaderBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import { checkEntry } from './actions/entry-actions';
import { update } from './actions/currentEntry-actions';

export const EntryBox = ({ entries, currentEntry, ...props }) => {
  const bodyStyle = { padding: 75 };
  return (
    <Container fluid>
      <HeaderBar />
      <Row style={bodyStyle}>
        <EntryForm {...currentEntry} {...props} />
        <EntryList data={entries} {...props} />
      </Row>
    </Container>
  );
};

EntryBox.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.any,
};

const entryHash = ({host, port, proxyHost, proxyPort}) => {
  return `${host}:${port},${proxyHost},${proxyPort}`;
};

const mapStateToProps = state => ({
  currentEntry: state.currentEntry,
  entries: (() => {
    const finalMap = state.entries.reduce((entryMap, entry) => {
      const hash = entryHash(entry);
      const temp = (entryMap[hash] || { ...entry, connections: [] });
      return {
        ...entryMap,
        [hash]: {
          ...entry,
          connections: temp.connections.concat(entry),
        },
      };
    }, {});
    return Object.keys(finalMap).map(key => finalMap[key]).sort((a, b) => a.time - b.time);
  })(),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: entry => dispatch(checkEntry(entry)),
  onChange: entry => dispatch(update(entry)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntryBox);