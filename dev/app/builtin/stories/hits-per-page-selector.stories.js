'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('HitsPerPageSelector'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hitsPerPageSelector({
      container: container,
      items: [{ value: 3, label: '3 per page' }, { value: 5, label: '5 per page' }, { value: 10, label: '10 per page' }]
    }));
  })).add('with default hitPerPage to 5', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hitsPerPageSelector({
      container: container,
      items: [{ value: 3, label: '3 per page' }, { value: 5, label: '5 per page', default: true }, { value: 10, label: '10 per page' }]
    }));
  }));
};