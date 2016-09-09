/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */

// import { describe, it } from 'mocha';
// import { expect } from 'chai';

// import * as actions from '../../../main/script/actions/entry-actions';
import * as EntryActions from '../../../main/script/actions/entry-actions';
const { events, ...actions } = EntryActions;
const { submit } = actions;

/*
 CONN.SUBMIT -- { id?, host, port, proxy_host?, proxy_port? }
 CONN.FAILED -- { id }
 CONN.SUCCESS -- { id }
 */

describe('entry actions', () => {
  describe('#submit', () => {
    const entry = {
      host: 'abc',
      port: 123,
    };
    it('creates a SUBMIT action', () =>
      expect(submit(entry))
        .to.deep.eq({
          type: events.SUBMIT,
          data: entry,
      })
    );

    context('with a proxy', () => {
      const withProxy = {
        ...entry,
        proxy_host: 'my-proxy.com',
        proxy_port: '8080',
      };

      it('creates a SUBMIT action', () =>
        expect(submit(withProxy))
          .to.deep.eq({
            type: events.SUBMIT,
            data: withProxy,
        })
      );
    });

  });
});
