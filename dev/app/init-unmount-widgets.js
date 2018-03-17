'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('./utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapWithUnmount(getWidget, params) {
  return (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '\n      <div>\n        <div id="widgetContainer"></div>\n        <div style="margin: 10px; border-top: solid 1px #E4E4E4;">\n          <button id="unmount" style="float: left; margin-right: 10px; margin-top: 10px">\n            Unmount widget\n          </div>\n          <button id="remount" style="float: left; margin-right: 10px;">\n            Remount widget\n          </div>\n          <button id="reload" style="float: left;">\n            Reload\n          </div>\n        </div>\n      </div>\n    ';

    var widget = getWidget('#widgetContainer');

    window.search.addWidget(widget);

    function unmount() {
      window.search.removeWidget(widget);
      document.getElementById('unmount').removeEventListener('click', unmount, false);
    }

    function remount() {
      window.search.addWidget(widget);
      document.getElementById('remount').removeEventListener('click', remount, false);
    }

    function reload() {
      window.location.reload();
      document.getElementById('reload').removeEventListener('click', reload, false);
    }

    document.getElementById('unmount').addEventListener('click', unmount, false);

    document.getElementById('remount').addEventListener('click', remount, false);

    document.getElementById('reload').addEventListener('click', reload, false);
  }, params);
} /* eslint-disable import/default */

exports.default = function () {
  (0, _devNovel.storiesOf)('ClearAll').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.clearAll({ container: container });
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple'] },
      disjunctiveFacets: ['brand']
    }
  }));

  (0, _devNovel.storiesOf)('CurrentRefinedValues').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.currentRefinedValues({ container: container });
  }, {
    searchParameters: {
      disjunctiveFacetsRefinements: { brand: ['Apple', 'Samsung'] },
      disjunctiveFacets: ['brand']
    }
  }));

  (0, _devNovel.storiesOf)('HierarchicalMenu').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.hierarchicalMenu({
      container: container,
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders'
    });
  }, {
    searchParameters: {
      hierarchicalFacetsRefinements: {
        'hierarchicalCategories.lvl0': ['Cameras & Camcorders > Digital Cameras']
      }
    }
  }));

  (0, _devNovel.storiesOf)('Hits').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.hits({ container: container });
  }));

  (0, _devNovel.storiesOf)('HitsPerPage').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.hitsPerPageSelector({
      container: container,
      items: [{ value: 3, label: '3 per page' }, { value: 5, label: '5 per page' }, { value: 10, label: '10 per page' }]
    });
  }));

  (0, _devNovel.storiesOf)('InfiniteHits').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.infiniteHits({
      container: container,
      showMoreLabel: 'Show more',
      templates: {
        item: '{{name}}'
      }
    });
  }));

  (0, _devNovel.storiesOf)('Menu').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.menu({
      container: container,
      attributeName: 'categories'
    });
  }));

  (0, _devNovel.storiesOf)('NumericRefinementList').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.numericRefinementList({
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
    });
  }));

  (0, _devNovel.storiesOf)('NumericSelector').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.numericSelector({
      container: container,
      operator: '>=',
      attributeName: 'popularity',
      options: [{ label: 'Default', value: 0 }, { label: 'Top 10', value: 9991 }, { label: 'Top 100', value: 9901 }, { label: 'Top 500', value: 9501 }]
    });
  }));

  (0, _devNovel.storiesOf)('Pagination').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.pagination({
      container: container,
      maxPages: 20
    });
  }));

  (0, _devNovel.storiesOf)('PriceRanges').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.priceRanges({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price ranges'
      }
    });
  }));

  (0, _devNovel.storiesOf)('RefinementList').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.refinementList({
      container: container,
      attributeName: 'brand',
      operator: 'or',
      limit: 10,
      templates: {
        header: 'Brands'
      }
    });
  }));

  (0, _devNovel.storiesOf)('SearchBox').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true
    });
  }));

  (0, _devNovel.storiesOf)('SortBySelector').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.sortBySelector({
      container: container,
      indices: [{ name: 'instant_search', label: 'Most relevant' }, { name: 'instant_search_price_asc', label: 'Lowest price' }, { name: 'instant_search_price_desc', label: 'Highest price' }]
    });
  }));

  (0, _devNovel.storiesOf)('StarRating').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.starRating({
      container: container,
      attributeName: 'rating',
      max: 5,
      labels: {
        andUp: '& Up'
      },
      templates: {
        header: 'Rating'
      }
    });
  }));

  (0, _devNovel.storiesOf)('Stats').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.stats({ container: container });
  }));

  (0, _devNovel.storiesOf)('Toggle').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.toggle({
      container: container,
      attributeName: 'free_shipping',
      label: 'Free Shipping (toggle single value)',
      templates: {
        header: 'Shipping'
      }
    });
  }));

  (0, _devNovel.storiesOf)('rangeSlider').add('default', wrapWithUnmount(function (container) {
    return _index2.default.widgets.rangeSlider({
      container: container,
      attributeName: 'price',
      templates: {
        header: 'Price'
      },
      max: 500,
      step: 10,
      tooltips: {
        format: function format(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      }
    });
  }));
};