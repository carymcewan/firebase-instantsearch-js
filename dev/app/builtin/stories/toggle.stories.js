'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Toggle'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.toggle({
      container: container,
      attributeName: 'free_shipping',
      label: 'Free Shipping (toggle single value)',
      templates: {
        header: 'Shipping'
      }
    }));
  })).add('with on & off values', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.toggle({
      container: container,
      attributeName: 'brand',
      label: 'Canon (not checked) or sony (checked)',
      values: {
        on: 'Sony',
        off: 'Canon'
      },
      templates: {
        header: 'Google or amazon (toggle two values)'
      }
    }));
  }));
};