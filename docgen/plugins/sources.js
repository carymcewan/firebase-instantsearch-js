'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = sourcesPlugin;

var _glob = require('glob');

var _fs = require('fs');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sourcesPlugin(sources, _ref) {
  var ignore = _ref.ignore,
      computeFilename = _ref.computeFilename;

  return function (files, m, pluginDone) {
    return _async2.default.reduce(sources, {}, function (sourcesMemo, source, globDone) {
      (0, _glob.glob)(source, { ignore: ignore }, function (globErr, filenames) {
        if (globErr) {
          globDone(globErr);
          return;
        }

        _async2.default.reduce(filenames, {}, function (statMemo, filename, statDone) {
          (0, _fs.stat)(filename, function (statErr, stats) {
            if (statErr) {
              pluginDone(statErr);
              return;
            }

            statDone(null, _extends({}, statMemo, _defineProperty({}, computeFilename(filename), { stats: stats })));
          });
        }, function (err, filesnamesWithStat) {
          if (err) {
            globDone(err);
            return;
          }

          globDone(null, _extends({}, sourcesMemo, filesnamesWithStat));
        });
      });
    }, function (err, newFiles) {
      if (err) {
        pluginDone(err);
        return;
      }

      Object.assign(files, newFiles);
      pluginDone(null);
    });
  };
}