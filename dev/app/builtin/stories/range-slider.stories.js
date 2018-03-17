'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('RangeSlider'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('disabled', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      min: 100,
      max: 50,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('collapsible', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      collapsible: {
        collapsed: false
      },
      templates: {
        header: 'Price'
      }
    }));
  })).add('with step', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      step: 500,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('without pips', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      pips: false,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('with 0 as first pit', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      min: 0,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('with min boundaries', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      min: 36,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('with max boundaries', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      max: 36,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  })).add('with min / max boundaries', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      min: 10,
      max: 500,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    }));
  }));
};