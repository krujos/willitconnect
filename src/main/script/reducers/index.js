import { combineReducers } from 'redux';
import entries from './entries';
import currentEntry from './currentEntry';

export default combineReducers({
  entries, currentEntry,
});
