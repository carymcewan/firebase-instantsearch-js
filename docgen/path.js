'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootPath = undefined;

var _path = require('path');

var rootPath = exports.rootPath = function rootPath() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _path.join.apply(undefined, [__dirname, '..'].concat(args));
};