'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compare = require('wdio-visual-regression-service/compare');

var _testServer = require('./testServer.js');

var _testServer2 = _interopRequireDefault(_testServer);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var INDEX_PAGE = process.env.INDEX_PAGE || 'index';

function screenshotName(context) {
  var testName = context.test.title.replace(/ /g, '_');
  var name = context.browser.name.toLocaleLowerCase().replace(/ /g, '_');
  var _context$meta$viewpor = context.meta.viewport,
      width = _context$meta$viewpor.width,
      height = _context$meta$viewpor.height;


  return _path2.default.join(__dirname, 'screenshots', testName + '_' + name + '_' + width + 'x' + height + '.png');
}

var conf = {
  specs: ['./functional-tests/test.js'],
  reporters: ['dot'],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 50000,
    compilers: ['js:babel-core/register']
  },
  baseUrl: 'http://' + (process.env.CI === 'true' ? 'localhost' : '10.200.10.1') + ':9000',
  services: ['visual-regression'],
  visualRegression: {
    compare: new _compare.SaveScreenshot({
      screenshotName: screenshotName
    }),
    viewportChangePause: 300 // ms
  },
  onPrepare: function onPrepare() {
    return _testServer2.default.start();
  },
  before: function before() {
    browser.timeouts('implicit', 500);
    browser.url('/' + INDEX_PAGE + '.html');
    browser.waitForText('#hits', 30000);

    if (!browser.isMobile) {
      browser.windowHandle(function (handle) {
        return browser.windowHandleMaximize(handle);
      });
    }
  },
  beforeTest: function beforeTest() {
    (0, _utils.clearAll)();
    _utils.searchBox.clear();
  },
  onComplete: function onComplete() {
    _testServer2.default.stop();
  }
};

if (process.env.CI === 'true') {
  conf = _extends({}, conf, {
    services: [].concat(_toConsumableArray(conf.services), ['sauce']),
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    maxInstances: 5,
    sauceConnect: true,
    // See https://github.com/bermi/sauce-connect-launcher
    sauceConnectOpts: {
      // Log output from the `sc` process to stdout?
      verbose: true,
      // retry to establish a tunnel multiple times. (optional)
      connectRetries: 2,
      // retry to download the sauce connect archive multiple times. (optional)
      downloadRetries: 2
    },
    // we are not currently testing android nor microsoft edge
    // their selenium support is completely broken, nothing much to do here
    capabilities: [{
      browserName: 'chrome',
      platform: 'Windows 10',
      version: '', // latest stable
      screenResolution: '1280x1024'
    }, {
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: '11',
      screenResolution: '1280x1024'
    }, {
      browserName: 'safari',
      version: '9'
    }, {
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
      version: '',
      screenResolution: '1280x1024'
    }]
  });
} else {
  conf = _extends({
    host: '127.0.0.1',
    port: 4444,
    path: '/wd/hub',
    capabilities: [{ browserName: 'firefox' }]
  }, conf);
}

exports.default = conf;