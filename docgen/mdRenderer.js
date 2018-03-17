'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _markdownItAnchor = require('markdown-it-anchor');

var _markdownItAnchor2 = _interopRequireDefault(_markdownItAnchor);

var _syntaxHighlighting = require('./syntaxHighlighting.js');

var _syntaxHighlighting2 = _interopRequireDefault(_syntaxHighlighting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md = new _markdownIt2.default('default', {
  highlight: function highlight(str, lang) {
    return (0, _syntaxHighlighting2.default)(str, lang);
  },
  linkify: true,
  typographer: true,
  html: true
}).use(_markdownItAnchor2.default, {
  permalink: true,
  permalinkClass: 'anchor',
  permalinkSymbol: '',
  // generate proper getting-started.html#install hrefs since we are
  // using the base href trick to handle different base urls (dev, prod)
  permalinkHref: function permalinkHref(slug, _ref) {
    var path = _ref.env.path;
    return path + '#' + slug;
  }
});

exports.default = md;