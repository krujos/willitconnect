const chai = require('chai');

global.assert = chai.assert;

const context = require.context('./src/main/resources/static/scripts/test', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
