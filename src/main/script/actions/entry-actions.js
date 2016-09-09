import fetch from 'isomorphic-fetch';

export const SUBMIT = 'SUBMIT';
export const PASSED = 'PASSED';
export const FAILED = 'FAILED';
export const RESULT = 'RESULT';
export const events = {
  SUBMIT,
  PASSED,
  FAILED,
  RESULT,
};

const create = type => data => ({ type, data });
export const passed = create(events.PASSED);
export const failed = create(events.FAILED);
export const submit = create(events.SUBMIT);
export const result = create(events.RESULT);

const hostPort = (host, port) => {
  if (host && port) {
    return `${host}:${port}`;
  }
  return undefined;
};

const toBody = entry => JSON.stringify({
  target: hostPort(entry.host, entry.port),
  http_proxy: hostPort(entry.proxyHost, entry.proxyPort),
});


// thunk action
export const checkEntry = entry => (dispatch) => {
  const id = Math.random().toString(36);
  if (entry.host == null || entry.host === '') {
    return;
  }
  // let store know we submitted
  dispatch(submit({ id, ...entry }));

  const path = '/v2/willitconnect';
  const response = fetch(path, {
    method: 'POST',
    body: toBody(entry),
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
    .then(r => {
      if (r.status !== 200) throw r;
      return r;
    })
    .then(r => r.json());
  response
    .then(body => {
      if (!body.canConnect) {
        throw id;
      }
      return id;
    })
    .then(passed,failed)
    .then(dispatch);
  response
    .then(r => ({ time: r.lastChecked, ...r }))
    .then(null, () => ({ time: Date.now() }))
    .then(r => dispatch(result({ id, ...r })));
};
