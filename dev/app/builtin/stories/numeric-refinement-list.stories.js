'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('NumericRefinementList'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.numericRefinementList({
      container: container,
      attributeName: 'price',
      operator: 'or',
      options: [{ name: 'All' }, { end: 4, name: 'less than 4' }, { start: 4, end: 4, name: '4' }, { start: 5, end: 10, name: 'between 5 and 10' }, { start: 10, name: 'more than 10' }],
      cssClasses: {
        header: 'facet-title',
        link: 'facet-value',
        count: 'facet-count pull-right',
        active: 'facet-active'
      },
      templates: {
        header: 'Numeric refinement list (price)'
      }
    }));
  }));
};