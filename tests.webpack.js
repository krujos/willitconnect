require("babel-polyfill");

const chai = require('chai');

global.assert = chai.assert;
const enzyme = require('enzyme');

const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

const context = require.context('./src/test/script', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
