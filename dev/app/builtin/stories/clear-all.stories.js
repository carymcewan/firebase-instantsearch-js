'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('ClearAll'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.clearAll({
      container: container,
      autoHideContainer: false
    }));
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple'] },
      disjunctiveFacets: ['brand']
    }
  })).add('with nothing to clear', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.clearAll({
      container: container,
      autoHideContainer: false
    }));
  })).add('with clear refinements and query', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.clearAll({
      container: container,
      autoHideContainer: false,
      clearsQuery: true,
      templates: {
        link: 'Clear refinements and query'
      }
    }));
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple'] },
      disjunctiveFacets: ['brand']
    }
  }));
};