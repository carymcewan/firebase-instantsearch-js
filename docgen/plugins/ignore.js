"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ignore;
function ignore(testFn) {
  return function (files, metalsmith, cb) {
    Object.keys(files).forEach(function (fileName) {
      if (testFn(fileName) === true) delete files[fileName];
    });

    cb(null);
  };
}