'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('RangeInput'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Range input'
      }
    }));
  })).add('disabled', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      min: 500,
      max: 0,
      templates: {
        header: 'Range input'
      }
    }));
  })).add('collapsible', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      collapsible: true,
      templates: {
        header: 'Range input'
      }
    }));
  })).add('with floating number', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      precision: 2,
      templates: {
        header: 'Range input'
      }
    }));
  })).add('with min boundary', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      min: 10,
      templates: {
        header: 'Range input'
      }
    }));
  })).add('with max boundary', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      max: 500,
      templates: {
        header: 'Range input'
      }
    }));
  })).add('with min & max boundaries', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeInput({
      container: container,
      attributeName: 'price',
      min: 10,
      max: 500,
      templates: {
        header: 'Range input'
      }
    }));
  }));
};