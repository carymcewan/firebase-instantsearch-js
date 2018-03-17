'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var compiler = (0, _webpack2.default)(_webpackConfigStart2.default);
  var bs = _browserSync2.default.create();
  bs.init({
    server: _config2.default.docsDist,
    open: false,
    files: _config2.default.docsDist + '/**/*',
    watchOptions: {
      ignored: [/\.js$/, // any change to a JavaScript file must be ignored, webpack handles it
      /\.css\.map$/],
      awaitWriteFinish: {
        stabilityThreshold: 150 // wait 150ms for the filesize to be stable (= write finished)
      }
    },
    notify: {
      styles: {
        bottom: 0,
        top: 'auto'
      }
    },
    middleware: [(0, _compression2.default)(), (0, _webpackDevMiddleware2.default)(compiler, {
      logLevel: 'warn',
      publicPath: _webpackConfigStart2.default.output.publicPath
    }), (0, _webpackHotMiddleware2.default)(compiler)]
  });
};

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _webpackConfigStart = require('./webpack.config.start.babel');

var _webpackConfigStart2 = _interopRequireDefault(_webpackConfigStart);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }