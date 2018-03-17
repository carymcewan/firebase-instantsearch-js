'use strict';

var _child_process = require('child_process');

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _devFunctionalTestsCompileWatch = require('./dev-functional-tests-compile-watch.js');

var _devFunctionalTestsCompileWatch2 = _interopRequireDefault(_devFunctionalTestsCompileWatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REBUILD_TIMEOUT = 1500; /* eslint-disable no-console */

var wdio = void 0;
var launch = (0, _debounce2.default)(function () {
  if (wdio) {
    console.log('Restarting tests');
    wdio.kill('SIGINT');
    wdio.kill('SIGINT'); // we need two of them, that's the way wdio works for killing process
  }
  wdio = (0, _child_process.spawn)('wdio', ['functional-tests/wdio.conf.js'], {
    stdio: [null, process.stdout, null]
  });
}, REBUILD_TIMEOUT, {
  leading: true,
  trailing: true
});

(0, _devFunctionalTestsCompileWatch2.default)(launch);