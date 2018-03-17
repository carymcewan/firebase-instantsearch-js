'use strict';

var _devNovel = require('dev-novel');

var _initStories = require('./builtin/init-stories');

var _initStories2 = _interopRequireDefault(_initStories);

var _initStories3 = require('./jquery/init-stories');

var _initStories4 = _interopRequireDefault(_initStories3);

var _initStories5 = require('./vanilla/init-stories');

var _initStories6 = _interopRequireDefault(_initStories5);

var _initUnmountWidgets = require('./init-unmount-widgets.js');

var _initUnmountWidgets2 = _interopRequireDefault(_initUnmountWidgets);

require('../style.css');

require('../../src/css/instantsearch.scss');

require('../../src/css/instantsearch-theme-algolia.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _devNovel.registerDisposer)(function () {
  window.search = undefined;
  delete window.search;
});

var q = window.location.search;

switch (true) {
  case q.includes('widgets=vanilla'):
    (0, _initStories6.default)();
    break;
  case q.includes('widgets=jquery'):
    (0, _initStories4.default)();
    break;
  case q.includes('widgets=unmount'):
    (0, _initUnmountWidgets2.default)();
    break;
  default:
    (0, _initStories2.default)();
}

(0, _devNovel.start)({
  projectName: 'instantsearch.js',
  projectLink: 'https://community.algolia.com/instantsearch.js/'
});