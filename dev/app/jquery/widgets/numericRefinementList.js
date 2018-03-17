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
      _ref$widgetParams = _ref.widgetParams,
      containerNode = _ref$widgetParams.containerNode,
      attributeName = _ref$widgetParams.attributeName,
      _ref$widgetParams$tit = _ref$widgetParams.title,
      title = _ref$widgetParams$tit === undefined ? 'Numeric refinement list' : _ref$widgetParams$tit;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">' + title + '</div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;"></ul>\n    ';
    containerNode.append(markup);
  }

  // remove event listeners if any before attachign new ones
  containerNode.find('li[data-refine-value]').each(function () {
    window.$(this).off();
  });

  var list = items.map(function (item) {
    return '\n    <li\n      class="facet-value clearfix"\n      data-refine-value="' + item.value + '"\n    >\n      <label\n        style="display: block;"\n        class="ais-refinement-list--label"\n      >\n        <input\n          type="radio"\n          name="' + attributeName + '"\n          ' + (item.isRefined ? 'checked' : '') + '\n        />\n        ' + item.label + '\n      </label>\n    </li>\n  ';
  });

  containerNode.find('ul').html(list);

  containerNode.find('li[data-refine-value]').each(function () {
    var _this = this;

    window.$(this).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      refine(window.$(_this).data('refine-value'));
    });
  });
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectNumericRefinementList(renderFn);