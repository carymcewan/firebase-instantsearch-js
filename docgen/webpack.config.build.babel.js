'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // this is the webpack config when running `npm run docs:build`

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackConfigBabel = require('./webpack.config.babel.js');

var _webpackConfigBabel2 = _interopRequireDefault(_webpackConfigBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = _extends({}, _webpackConfigBabel2.default, {
  output: _extends({}, _webpackConfigBabel2.default.output, {
    filename: '[name].[hash]-build.js' // hash names in production
  }),
  plugins: [new _webpack2.default.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      comparisons: false
    },
    output: {
      comments: false,
      ascii_only: true
    },
    sourceMap: true
  })].concat(_toConsumableArray(_webpackConfigBabel2.default.plugins))
});