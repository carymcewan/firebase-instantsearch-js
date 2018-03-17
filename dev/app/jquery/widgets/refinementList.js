'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var items = _ref.items,
      refine = _ref.refine,
      canRefine = _ref.canRefine,
      createURL = _ref.createURL,
      _ref$widgetParams = _ref.widgetParams,
      containerNode = _ref$widgetParams.containerNode,
      title = _ref$widgetParams.title;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">' + title + '</div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;"></ul>\n    ';

    containerNode.append(markup);
  }

  // remove event listeners if any before attaching new ones
  window.$('li[data-refine-value]').each(function () {
    window.$(this).off();
  });

  if (canRefine) {
    var list = items.map(function (item) {
      return '\n      <li\n        data-refine-value="' + item.value + '"\n        class="facet-value checkbox clearfix"\n      >\n        <label style="display: block;">\n          <input\n            type="checkbox"\n            value="' + item.value + '"\n            ' + (item.isRefined ? 'checked' : '') + '\n          />\n\n          <a\n            href="' + createURL(item.value) + '"\n            style="text-decoration: none; color: #000;"\n          >\n            ' + (item.isRefined ? '<strong>' + item.label + '</strong>' : item.label) + '\n          </a>\n\n          <span class="facet-count pull-right">\n            ' + item.count + '\n          </span>\n        </label>\n      </li>\n    ';
    });

    containerNode.find('ul').html(list.join(''));

    containerNode.find('li[data-refine-value]').each(function () {
      var _this = this;

      window.$(this).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        refine(window.$(_this).data('refine-value'));
      });
    });
  }
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectRefinementList(renderFn);