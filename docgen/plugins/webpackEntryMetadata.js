"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = webpackEntryMetadata;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// this plugin adds the webpack entry points to metadata.webpack.assets
// useful in dev mode when not using ms-webpack
function webpackEntryMetadata(webpackConfig) {
  return function (filenames, metalsmith, cb) {
    metalsmith.metadata().webpack = {
      assets: Object.keys(webpackConfig.entry).reduce(function (memo, entryName) {
        return _extends({}, memo, _defineProperty({}, entryName + ".js", "" + webpackConfig.output.publicPath + entryName + ".js"));
      }, {})
    };

    cb();
  };
}