'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable no-console */

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _watch = require('watch');

var _watch2 = _interopRequireDefault(_watch);

var _path = require('path');

var _webpackConfig = require('./webpack.config.js');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = (0, _webpack2.default)(_webpackConfig2.default);

exports.default = function (cb) {
  // watch webpack
  compiler.watch({
    aggregateTimeout: 300,
    usePolling: true
  }, compilationDone);

  // watch test files
  // first call triggers a watch, but we already have webpack watch triggering
  // so we ignore first call
  _watch2.default.watchTree((0, _path.join)(__dirname, '..', 'functional-tests'), function (f, curr, prev) {
    // Finished walking the tree
    if ((typeof f === 'undefined' ? 'undefined' : _typeof(f)) === 'object' && prev === null && curr === null) {
      return;
    }

    // As the ignoreDirectoryPattern option is not working
    if (f.match(/functional-tests\/screenshots/) !== null) {
      return;
    }

    console.log('Got test file change');
    cb();
  });

  function compilationDone(err) {
    if (err) {
      throw err;
    }

    console.log('Got webpack compilation event');
    cb();
  }
};