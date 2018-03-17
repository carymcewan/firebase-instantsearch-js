'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var value = _ref.value,
      createURL = _ref.createURL,
      refine = _ref.refine,
      _ref$widgetParams = _ref.widgetParams,
      _ref$widgetParams$tit = _ref$widgetParams.title,
      title = _ref$widgetParams$tit === undefined ? 'Toggle' : _ref$widgetParams$tit,
      containerNode = _ref$widgetParams.containerNode;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">' + title + '</div>\n      <div class="facet-value checkbox"></div>\n    ';

    containerNode.append(markup);
  }

  var $facetValue = containerNode.find('.facet-value');

  $facetValue.off('click');
  $facetValue.html('\n    <a\n      href="' + createURL() + '"\n      style="text-decoration: none; color: #000"\n    >\n      <label\n        style="display: block;"\n        class="clearfix"\n      >\n        <input\n          type="checkbox"\n          value="' + value.name + '"\n          ' + (value.isRefined ? 'checked' : '') + '\n        />\n        ' + value.name + '\n        <span class="facet-count pull-right">\n          ' + value.count + '\n        </span>\n      </label>\n    </a>\n  ');

  $facetValue.on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    refine(value);
  });
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectToggle(renderFn);