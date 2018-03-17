'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // this is the webpack config when running `npm start`

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackConfigBabel = require('./webpack.config.babel.js');

var _webpackConfigBabel2 = _interopRequireDefault(_webpackConfigBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = _extends({}, _webpackConfigBabel2.default, {
  devtool: 'eval-source-map',

  entry: _extends({}, Object.entries(_webpackConfigBabel2.default.entry).reduce(function (memo, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        entryName = _ref2[0],
        entryValue = _ref2[1];

    return _extends({}, memo, _defineProperty({}, entryName, ['webpack-hot-middleware/client?reload=true', entryValue]));
  }, {})),

  plugins: [new _webpack2.default.LoaderOptionsPlugin({ debug: true }), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoEmitOnErrorsPlugin()].concat(_toConsumableArray(_webpackConfigBabel2.default.plugins))
});