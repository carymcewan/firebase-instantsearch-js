'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // extracted from https://github.com/treygriffith/metalsmith-assets
// converted to es6 (http://lebab.io/try-it)
// tweaked to add `stats` to the file object

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _recursiveReaddir = require('recursive-readdir');

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir);

var _statMode = require('stat-mode');

var _statMode2 = _interopRequireDefault(_statMode);

var _async = require('async');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Expose `assets`.
 */

exports.default = assets;

/**
 * Default plugin options
 */

var defaults = {
  source: './public',
  destination: '.'
};

/**
 * Metalsmith plugin to include static assets.
 *
 * @param {Object} userOptions (optional)
 *   @property {String} source Path to copy static assets from (relative to working directory). Defaults to './public'
 *   @property {String} destination Path to copy static assets to (relative to destination directory). Defaults to '.'
 * @return {function} a Metalsmith plugin
 */
function assets() {
  var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = _extends({}, defaults, userOptions);

  return function (files, metalsmith, cb) {
    var src = metalsmith.path(options.source);
    var dest = options.destination;

    // copied almost line for line from https://github.com/segmentio/metalsmith/blob/master/lib/index.js
    (0, _recursiveReaddir2.default)(src, function (readDirError, arr) {
      if (readDirError) {
        cb(readDirError);
        return;
      }

      (0, _async.each)(arr, read, function (err) {
        return cb(err, files);
      });
    });

    function read(file, done) {
      var name = _path2.default.join(dest, _path2.default.relative(src, file));
      _fs2.default.stat(file, function (statError, stats) {
        if (statError) {
          done(statError);
          return;
        }

        _fs2.default.readFile(file, function (err, buffer) {
          if (err) {
            done(err);
            return;
          }

          var newFile = {};

          newFile.contents = buffer;
          newFile.stats = stats;

          newFile.mode = (0, _statMode2.default)(stats).toOctal();
          files[name] = newFile;
          done();
        });
      });
    }
  };
}