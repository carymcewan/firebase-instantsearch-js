'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasChanged = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // This plugin mutates the `files` map of metalsmith
// at build time to only keep what was updated
// We consider any update in layouts/ to trigger an update on every html file
// Otherwise, if it's an asset or a file with no layout then we compare
// the file's last modification time to the process start time

exports.default = onlyChanged;

var _path = require('path');

var _async = require('async');

var _chokidar = require('chokidar');

var lastRunTime = false;
var layoutChange = true;
var cssChange = true;
var layoutFiles = (0, _path.join)(__dirname, '../layouts/**/*');
var cssFiles = (0, _path.join)(__dirname, '../src/stylesheets/**/*');
var CSSEntryPoints = ['stylesheets/index.css', 'stylesheets/header.css'];

var hasChanged = exports.hasChanged = function hasChanged(file) {
  return file.stats && file.stats.ctime && file.stats.mtime ? Date.parse(file.stats.ctime) > lastRunTime || Date.parse(file.stats.mtime) > lastRunTime : true;
};

function onlyChanged(files, metalsmith, cb) {
  if (lastRunTime === false) {
    (0, _chokidar.watch)(layoutFiles, { ignoreInitial: true }).on('all', function () {
      layoutChange = true;
    }).on('error', function (err) {
      throw err;
    });

    (0, _chokidar.watch)(cssFiles, { ignoreInitial: true }).on('all', function () {
      cssChange = true;
    }).on('error', function (err) {
      throw err;
    });

    lastRunTime = Date.now();
    layoutChange = false;
    cssChange = false;
    cb(null);
    return;
  }

  (0, _async.parallel)(Object.entries(files).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        file = _ref2[1];

    return function (done) {
      if (!file.stats) {
        done(null); // keep file, we do not know
        return;
      }

      if (!file.layout) {
        var cssEntryPointNeedsUpdate = CSSEntryPoints.indexOf(name) !== -1 && cssChange === true;

        if (!hasChanged(file) && !cssEntryPointNeedsUpdate) {
          // file has no layout and was not updated, remove file
          // from files to process
          delete files[name];
        }

        done(null);
        return;
      }

      if (/\.html$/.test(name) && layoutChange === true) {
        done(null); // html page need rebuild, some layout files changed
        return;
      }

      if (!hasChanged(file)) {
        delete files[name]; // file was not updated, layouts were not updated
      }

      done(null);
    };
  }), function (err) {
    if (!err) {
      lastRunTime = Date.now();
      layoutChange = false;
      cssChange = false;
      console.log('[metalsmith]: onlyChanged | ' + Object.keys(files)); // eslint-disable-line no-console
    }
    cb(err);
  });
}