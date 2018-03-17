'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-console */

var start = exports.start = function start() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'performance';
  return function (files, metalsmith, cb) {
    console.time(label);
    console.log(Object.entries(files).length + ' file(s) to process: ' + Object.keys(files));
    cb();
  };
};

var stop = exports.stop = function stop() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'performance';
  return function (files, metalsmith, cb) {
    console.timeEnd(label);
    cb();
  };
};