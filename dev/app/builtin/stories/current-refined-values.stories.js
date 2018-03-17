'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('CurrentRefinedValues'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.currentRefinedValues({ container: container }));
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple', 'Samsung'] },
      disjunctiveFacets: ['brand'],
      numericRefinements: { price: { '>=': [100] } }
    }
  })).add('with header', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.currentRefinedValues({
      container: container,
      templates: {
        header: 'Current refinements'
      }
    }));
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple', 'Samsung'] },
      disjunctiveFacets: ['brand'],
      numericRefinements: { price: { '>=': [100] } }
    }
  })).add('with header but no refinements', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.currentRefinedValues({
      container: container,
      autoHideContainer: false,
      templates: {
        header: 'Current refinements'
      }
    }));
  })).add('with clearsQuery', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.currentRefinedValues({
      container: container,
      clearsQuery: true
    }));
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple', 'Samsung'] },
      disjunctiveFacets: ['brand'],
      numericRefinements: { price: { '>=': [100] } }
    }
  }));
};