import { SUBMIT, FAILED, PASSED, RESULT } from '../actions/entry-actions';

const entryStatus = status => id => entry => {
  if (entry.id === id) {
    return ({ ...entry, status });
  }
  return entry;
};

const entryPassed = entryStatus(PASSED);
const entryFailed = entryStatus(FAILED);

export default (state = [], { type, data }) => {
  switch (type) {
    case SUBMIT:
      return [...state, data];
    case FAILED:
      return state.map(entryFailed(data));
    case PASSED:
      return state.map(entryPassed(data));
    case RESULT:
      return state.map((entry) => {
        if (entry.id === data.id) {
          return { ...entry, ...data };
        }
        return entry;
      });
    default:
      return state;
  }
};
