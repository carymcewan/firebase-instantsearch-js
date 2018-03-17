'use strict';

var _testServer = require('../functional-tests/testServer.js');

var _testServer2 = _interopRequireDefault(_testServer);

var _devFunctionalTestsCompileWatch = require('./dev-functional-tests-compile-watch.js');

var _devFunctionalTestsCompileWatch2 = _interopRequireDefault(_devFunctionalTestsCompileWatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
(0, _devFunctionalTestsCompileWatch2.default)(function () {});

_testServer2.default.start().then(function (serverInstance) {
  return console.log('http://localhost:' + serverInstance.address().port);
}).catch(function (e) {
  return setTimeout(function () {
    throw e;
  }, 0);
});