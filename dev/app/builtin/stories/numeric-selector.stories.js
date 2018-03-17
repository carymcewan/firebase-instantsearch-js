'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('NumericSelector'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.numericSelector({
      container: container,
      operator: '>=',
      attributeName: 'popularity',
      options: [{ label: 'Default', value: 0 }, { label: 'Top 10', value: 21459 }, { label: 'Top 100', value: 21369 }, { label: 'Top 500', value: 20969 }]
    }));
  }));
  stories.add('with default value', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.numericSelector({
      container: container,
      operator: '=',
      attributeName: 'rating',
      options: [{ label: 'No rating selected', value: undefined }, { label: 'Rating: 5', value: 5 }, { label: 'Rating: 4', value: 4 }, { label: 'Rating: 3', value: 3 }, { label: 'Rating: 2', value: 2 }, { label: 'Rating: 1', value: 1 }]
    }));
  }));
};