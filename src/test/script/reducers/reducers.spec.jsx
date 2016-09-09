/* eslint-env node, mocha */
import { createStore } from 'redux';
import * as EntryActions from '../../../main/script/actions/entry-actions';
import * as CurrentEntryActions from '../../../main/script/actions/currentEntry-actions';

import reducers from '../../../main/script/reducers';


const { PASSED, FAILED } = EntryActions;

const google = {
  id: 'GOOGLE999444',
  host: 'google.com',
  port: '80',
};
const yahoo = {
  id: 'YAHOOaaabbb',
  host: 'yahoo.com',
  port: '80',
  proxy_host: 'myproxy.com',
  proxy_port: '8080',
};
describe('reducers',()=> {
  var store;
  const getState = () => store.getState();
  const getEntries = () => getState().entries;

  beforeEach(()=>{
    store = createStore(reducers);
  });
  describe('.entries', () => {


    it('defaults to an empty array', () =>
      expect(getEntries()).to.deep.eq([]));

    describe('when we submit an entry', () => {
      it('is added to the list', () => {

        const action = EntryActions.submit(google);
        store.dispatch(action);

        expect(getEntries())
          .to.deep.eq([
            google,
          ]);
      });

      it('keeps a list of submitted entries', () => {
        store.dispatch(EntryActions.submit(google));
        store.dispatch(EntryActions.submit(yahoo));

        expect(getEntries()).to.deep.eq([
          google,
          yahoo,
        ]);
      });
    });

    describe('when an entry fails', () => {
      beforeEach(() => {
        store.dispatch(EntryActions.submit(google));
        store.dispatch(EntryActions.submit(yahoo));
      });
      it("sets that entry's `status` to 'FAIL'", () => {
        const action = EntryActions.failed(google.id);
        store.dispatch(action);
        expect(getEntries()).to.deep.eq([
          { ...google, status: FAILED },
          yahoo,
        ]);
      });
    });

    describe('when an entry succeeds', () => {
      beforeEach(() => {
        store.dispatch(EntryActions.submit(google));
        store.dispatch(EntryActions.submit(yahoo));
      });

      it("sets that entry's `status` to 'PASSED'", () => {
        const action = EntryActions.passed(google.id);
        store.dispatch(action);

        expect(getEntries()).to.deep.eq([
          { ...google, status: PASSED },
          yahoo,
        ]);
      });
    });
  });
  describe('.currentEntry', () => {
    const getEntry = () => store.getState().currentEntry;
    it('starts blank', () =>
      expect(getEntry())
        .to.deep.eq({}));

    it('updates via the `UPDATE` event', () => {
      const { update } = CurrentEntryActions;
      const event = update({
        host: 'hello.com',
      });
      store.dispatch(event);

      expect(getEntry()).to.deep.eq({
        host: 'hello.com',
      });
    });
  });
});