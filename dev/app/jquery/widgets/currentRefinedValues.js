'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var clearAllClick = _ref.clearAllClick,
      clearAllURL = _ref.clearAllURL,
      createURL = _ref.createURL,
      refine = _ref.refine,
      refinements = _ref.refinements,
      containerNode = _ref.widgetParams.containerNode;

  // append initial markup on first rendering
  // ----------------------------------------
  if (isFirstRendering) {
    var markup = window.$('\n      <div class="facet-title">Custom current refinements</div>\n      <div id="custom-crv-clear-all-container"></div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;"></ul>\n    ');
    containerNode.append(markup);
  }

  if (refinements && refinements.length > 0) {
    // append clear all link
    // ---------------------
    containerNode.find('#custom-crv-clear-all-container').html('\n        <a\n          href="' + clearAllURL + '"\n          class="ais-current-refined-values--clear-all"\n        >\n          Clear all\n        </a>\n      ');

    containerNode.find('#custom-crv-clear-all-container > a').off('click').on('click', function (e) {
      e.preventDefault();
      clearAllClick();
    });

    // show current refined values
    // ---------------------------
    var list = refinements.map(function (value) {
      var computedLabel = value.computedLabel,
          count = value.count;


      var afterCount = count ? '<span class="pull-right facet-count">' + count + '</span>' : '';

      switch (true) {
        case value.attributeName === 'price_range':
          return 'Price range: ' + computedLabel.replace(/(\d+)/g, '$$$1') + ' ' + afterCount;

        case value.attributeName === 'price':
          return 'Price: ' + computedLabel.replace(/(\d+)/g, '$$$1');

        case value.attributeName === 'free_shipping':
          return computedLabel === 'true' ? 'Free shipping ' + afterCount : '';

        default:
          return computedLabel + ' ' + afterCount;
      }
    }).map(function (content, index) {
      return '\n        <li>\n          <a\n            href="' + createURL(refinements[index]) + '"\n            class="facet-value facet-value-removable clearfix"\n          >\n            ' + content + '\n          </a>\n        </li>\n      ';
    });

    containerNode.find('ul').html(list.join(''));

    // bind click events on links
    // --------------------------
    containerNode.find('li > a').each(function (index) {
      window.$(this).off('click').on('click', function (e) {
        e.preventDefault();
        refine(refinements[index]);
      });
    });

    // show container
    // --------------
    containerNode.find('#custom-current-refined-values').show();
  } else {
    // remove refinements list and clear all button, hide the container
    // ----------------------------------------------------------------
    containerNode.find('ul').html('');
    containerNode.find('#custom-crv-clear-all-container').html('');
    containerNode.find('#custom-current-refined-values').hide();
  }
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectCurrentRefinedValues(renderFn);