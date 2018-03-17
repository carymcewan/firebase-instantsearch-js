'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  devtool: 'source-map',

  entry: {
    'js/main': (0, _path.join)(__dirname, 'assets/js/main.js')
  },

  output: {
    path: _config2.default.docsDist,
    publicPath: _config2.default.publicPath,
    filename: '[name].js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!algolia-frontend-components\/components)/,
      use: 'babel-loader'
    }, {
      test: /\.s?(c|a)ss$/,
      use: [{ loader: 'style-loader?insertAt=top', options: { sourceMap: true } }, { loader: 'css-loader', options: { sourceMap: true } }, { loader: 'postcss-loader', options: { sourceMap: true } }, { loader: 'sass-loader', options: { sourceMap: true } }]
    }]
  },

  resolve: {
    alias: {
      'react-instantsearch': (0, _path.join)(__dirname, '../packages/react-instantsearch/'),
      'react-instantsearch-theme-algolia': (0, _path.join)(__dirname, '../packages/react-instantsearch-theme-algolia/')
    }
  },

  // replace usage of process.env.NODE_ENV with the actual NODE_ENV from command line
  // when building. Some modules might be using it, this way we will reduce the code output when
  // NODE_ENV === 'production' and NODE_ENV=production was used to build
  plugins: [new _webpack2.default.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })]
};