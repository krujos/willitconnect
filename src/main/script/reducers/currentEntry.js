import { UPDATE } from '../actions/currentEntry-actions';

export default (state = {}, { type, data }) => {
  switch (type) {
    case UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
};
