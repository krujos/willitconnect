import PropTypes from 'prop-types';
import React from 'react';
import StatefulEntry from './Entry';

const EntryList = (props) => {
  const entryNodes = props.data.map(entry => {
    return (
      <StatefulEntry
        key={entry.id}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        {...entry}
      />
    );
  }).reverse();
  return (
    <div className="entryList">
      {entryNodes}
    </div>
  );
};
export default EntryList;

EntryList.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
EntryList.defaultProps = {
  data: [],
};