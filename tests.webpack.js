const chai = require('chai');

global.assert = chai.assert;

const context = require.context('./src/main/script/test', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
