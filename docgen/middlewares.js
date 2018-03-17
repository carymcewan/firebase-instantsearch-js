'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = exports.start = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// performance and debug info for metalsmith, when needed see usage below
// import {start as perfStart, stop as perfStop} from './plugins/perf.js';

var _metalsmithHeadings = require('metalsmith-headings');

var _metalsmithHeadings2 = _interopRequireDefault(_metalsmithHeadings);

var _metalsmithLayouts = require('metalsmith-layouts');

var _metalsmithLayouts2 = _interopRequireDefault(_metalsmithLayouts);

var _msWebpack = require('ms-webpack');

var _msWebpack2 = _interopRequireDefault(_msWebpack);

var _metalsmithNavigation = require('metalsmith-navigation');

var _metalsmithNavigation2 = _interopRequireDefault(_metalsmithNavigation);

var _navigation = require('./plugins/navigation.js');

var _navigation2 = _interopRequireDefault(_navigation);

var _searchConfig = require('./plugins/searchConfig.js');

var _searchConfig2 = _interopRequireDefault(_searchConfig);

var _metalsmithSass = require('metalsmith-sass');

var _metalsmithSass2 = _interopRequireDefault(_metalsmithSass);

var _metalsmithInPlace = require('metalsmith-in-place');

var _metalsmithInPlace2 = _interopRequireDefault(_metalsmithInPlace);

var _metalsmithCopy = require('metalsmith-copy');

var _metalsmithCopy2 = _interopRequireDefault(_metalsmithCopy);

var _assets = require('./plugins/assets.js');

var _assets2 = _interopRequireDefault(_assets);

var _helpers = require('./plugins/helpers.js');

var _helpers2 = _interopRequireDefault(_helpers);

var _ignore = require('./plugins/ignore.js');

var _ignore2 = _interopRequireDefault(_ignore);

var _markdown = require('./plugins/markdown.js');

var _markdown2 = _interopRequireDefault(_markdown);

var _onlyChanged = require('./plugins/onlyChanged.js');

var _onlyChanged2 = _interopRequireDefault(_onlyChanged);

var _webpackEntryMetadata = require('./plugins/webpackEntryMetadata.js');

var _webpackEntryMetadata2 = _interopRequireDefault(_webpackEntryMetadata);

var _autoprefixer = require('./plugins/autoprefixer.js');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _documentationjsData = require('./plugins/documentationjs-data.js');

var _documentationjsData2 = _interopRequireDefault(_documentationjsData);

var _webpackConfigStartBabel = require('./webpack.config.start.babel.js');

var _webpackConfigStartBabel2 = _interopRequireDefault(_webpackConfigStartBabel);

var _webpackConfigBuild = require('./webpack.config.build.babel');

var _webpackConfigBuild2 = _interopRequireDefault(_webpackConfigBuild);

var _path = require('./path.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var common = [_helpers2.default, (0, _assets2.default)({
  source: './assets/',
  destination: './assets/'
}), (0, _assets2.default)({
  source: '../dist',
  destination: './examples/media'
}), (0, _assets2.default)({
  source: '../dist',
  destination: './examples/e-commerce'
}), (0, _assets2.default)({
  source: '../dist',
  destination: './examples/tourism'
}), (0, _searchConfig2.default)(), (0, _ignore2.default)(function (fileName) {
  // This is a fix for VIM swp files inside src/,
  // We could also configure VIM to store swp files somewhere else
  // http://stackoverflow.com/questions/1636297/how-to-change-the-folder-path-for-swp-files-in-vim
  if (/\.swp$/.test(fileName)) return true;

  // if it's a build js file, keep it (`build`)
  if (/-build\.js$/.test(fileName)) return false;

  // if it's an example JavaScript file, keep it
  if (/examples\/(.*)?\.js$/.test(fileName)) return false;

  // if it's any other JavaScript file, ignore it, it's handled by build files above
  if (/\.js$/.test(fileName)) return true;

  // ignore scss partials, only include scss entrypoints
  if (/_.*\.s[ac]ss/.test(fileName)) return true;

  // otherwise, keep file
  return false;
}), (0, _documentationjsData2.default)({ rootJSFile: (0, _path.rootPath)('src/lib/main.js') }), (0, _metalsmithInPlace2.default)({
  pattern: "**/*.hbs"
}), _markdown2.default, (0, _metalsmithHeadings2.default)('h2'), (0, _navigation2.default)(),
// After markdown, so that paths point to the correct HTML file
(0, _metalsmithNavigation2.default)({
  core: {
    sortBy: 'nav_sort',
    filterProperty: 'nav_groups'
  },
  widget: {
    sortBy: 'nav_sort',
    filterProperty: 'nav_groups'
  },
  connector: {
    sortBy: 'nav_sort',
    filterProperty: 'nav_groups'
  },
  examples: {
    sortBy: 'nav_sort',
    filterProperty: 'nav_groups'
  },
  gettingstarted: {
    sortBy: 'nav_sort',
    filterProperty: 'nav_groups'
  }
}, {
  navListProperty: 'navs'
}),
// perfStart(),
(0, _metalsmithSass2.default)({
  sourceMap: true,
  sourceMapContents: true,
  outputStyle: 'nested'
}),
// since we use @import, autoprefixer is used after sass
_autoprefixer2.default, (0, _metalsmithCopy2.default)({
  pattern: '**',
  transform: function transform(path) {
    return 'v2/' + path;
  },
  move: true
}), (0, _metalsmithCopy2.default)({
  pattern: 'v2/index.html',
  transform: function transform(path) {
    return 'index.html';
  }
})];

// development mode
var start = exports.start = [(0, _webpackEntryMetadata2.default)(_webpackConfigStartBabel2.default)].concat(common, [
// onlyChanged,
(0, _metalsmithLayouts2.default)('pug')]);

var build = exports.build = [(0, _msWebpack2.default)(_extends({}, _webpackConfigBuild2.default, {
  stats: {
    chunks: false,
    modules: false,
    chunkModules: false,
    reasons: false,
    cached: false,
    cachedAssets: false
  }
}))].concat(common, [(0, _metalsmithLayouts2.default)('pug')]);