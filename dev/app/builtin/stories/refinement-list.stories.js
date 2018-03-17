'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('RefinementList'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.refinementList({
      container: container,
      attributeName: 'brand',
      operator: 'or',
      limit: 10,
      templates: {
        header: 'Brands'
      }
    }));
  })).add('with show more', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.refinementList({
      container: container,
      attributeName: 'brand',
      operator: 'or',
      limit: 3,
      templates: {
        header: 'Brands with show more'
      },
      showMore: {
        templates: {
          active: '<button>Show less</button>',
          inactive: '<button>Show more</button>'
        },
        limit: 10
      }
    }));
  })).add('with search inside items', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.refinementList({
      container: container,
      attributeName: 'brand',
      operator: 'or',
      limit: 10,
      templates: {
        header: 'Searchable brands'
      },
      searchForFacetValues: {
        placeholder: 'Find other brands...',
        templates: {
          noResults: 'No results'
        }
      }
    }));
  })).add('with search inside items (using the default noResults template)', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.refinementList({
      container: container,
      attributeName: 'brand',
      operator: 'or',
      limit: 10,
      templates: {
        header: 'Searchable brands'
      },
      searchForFacetValues: {
        placeholder: 'Find other brands...'
      }
    }));
  })).add('with operator `and`', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.refinementList({
      container: container,
      attributeName: 'price_range',
      operator: 'and',
      limit: 10,
      cssClasses: {
        header: 'facet-title',
        item: 'facet-value checkbox',
        count: 'facet-count pull-right',
        active: 'facet-active'
      },
      templates: {
        header: 'Price ranges'
      },
      transformData: function transformData(data) {
        data.label = data.label.replace(/(\d+) - (\d+)/, '$$$1 - $$$2').replace(/> (\d+)/, '> $$$1');
        return data;
      }
    }));
  }));
};