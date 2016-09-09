const chai = require('chai');

global.assert = chai.assert;

const context = require.context('./src/test/script', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
