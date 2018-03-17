'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatMenuEntry = function formatMenuEntry(createURL) {
  var lvl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (item) {
    var countHTML = '\n    <span class="pull-right facet-count">\n      ' + item.count + '\n    </span>\n  ';

    if (item.isRefined === true && Array.isArray(item.data) && item.data.length > 0) {
      return '\n      <div ' + (lvl === 0 ? 'class="hierarchical-categories-list"' : '') + '>\n        <a\n          href="' + createURL(item.value) + '"\n          class="facet-value clearfix"\n          data-refine-value="' + item.value + '"\n        >\n          <strong>' + item.label + '</strong> ' + countHTML + '\n        </a>\n        <div class="hierarchical-categories-list ais-hierarchical-menu--list__lvl' + (lvl + 1) + '">\n          ' + item.data.map(formatMenuEntry(createURL, lvl + 1)).join('') + '\n        </div>\n      </div>\n    ';
    }

    return '\n    <div>\n      <a\n        href="' + createURL(item.value) + '"\n        class="facet-value clearfix"\n        data-refine-value="' + item.value + '"\n      >\n        ' + (item.isRefined ? '<strong>' + item.label + '</strong>' : item.label) + ' ' + countHTML + '\n      </a>\n    </div>\n  ';
  };
}; /* eslint-disable import/default */


var renderFn = function renderFn(_ref, isFirstRendering) {
  var createURL = _ref.createURL,
      items = _ref.items,
      refine = _ref.refine,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    var markup = window.$('\n      <div class="facet-title">Custom hierarchical</div>\n      <div id="custom-hierarchical-menu__container"></div>\n    ');
    containerNode.append(markup);
  }

  // remove event listeners before replacing markup
  containerNode.find('a[data-refine-value]').each(function () {
    window.$(this).off('click');
  });

  if (items && items.length > 0) {
    // replace markup with items
    var menuItems = items.map(formatMenuEntry(createURL)).join('');

    containerNode.find('#custom-hierarchical-menu__container').html(menuItems);

    // bind links with `data-refine-value`
    containerNode.find('a[data-refine-value]').each(function () {
      var _this = this;

      window.$(this).on('click', function (e) {
        e.preventDefault();
        refine(window.$(_this).data('refine-value'));
      });
    });
  }
};

exports.default = _index2.default.connectors.connectHierarchicalMenu(renderFn);