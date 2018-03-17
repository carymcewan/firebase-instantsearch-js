'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clearAll = require('./stories/clear-all.stories');

var _clearAll2 = _interopRequireDefault(_clearAll);

var _hits = require('./stories/hits.stories');

var _hits2 = _interopRequireDefault(_hits);

var _menu = require('./stories/menu.stories');

var _menu2 = _interopRequireDefault(_menu);

var _refinementList = require('./stories/refinement-list.stories');

var _refinementList2 = _interopRequireDefault(_refinementList);

var _searchBox = require('./stories/search-box.stories');

var _searchBox2 = _interopRequireDefault(_searchBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  (0, _clearAll2.default)();
  (0, _hits2.default)();
  (0, _menu2.default)();
  (0, _refinementList2.default)();
  (0, _searchBox2.default)();
};