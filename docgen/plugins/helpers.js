'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = helpers;

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _syntaxHighlighting = require('../syntaxHighlighting.js');

var _syntaxHighlighting2 = _interopRequireDefault(_syntaxHighlighting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md = (0, _markdownIt2.default)();

// this plugin provides ATM one helper to easily compute the publicPath of assets
function helpers(filenames, metalsmith, cb) {
  metalsmith.metadata().h = {
    markdown: function markdown(src) {
      return md.render(src);
    },
    highlight: function highlight(src, opts) {
      var lang = opts && opts.lang;
      var inline = opts && opts.inline;
      var runnable = opts && opts.runnable;

      return (0, _syntaxHighlighting2.default)(src, lang, inline, runnable);
    },
    maybeActive: function maybeActive(navPath, singlePathOrArrayOfPaths) {
      var pathsToTest = [].concat(singlePathOrArrayOfPaths);
      return pathsToTest.some(function (pathToTest) {
        return navPath.indexOf(pathToTest) === 0;
      }) ? 'active' : '';
    }
  };

  cb();
}