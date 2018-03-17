'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('SortBySelector'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.sortBySelector({
      container: container,
      indices: [{ name: 'instant_search', label: 'Most relevant' }, { name: 'instant_search_price_asc', label: 'Lowest price' }, { name: 'instant_search_price_desc', label: 'Highest price' }]
    }));
  }));
};