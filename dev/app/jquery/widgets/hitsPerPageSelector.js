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
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    var markup = '<select></select>';
    containerNode.append(markup);
  }

  var itemsHTML = items.map(function (_ref2) {
    var value = _ref2.value,
        label = _ref2.label,
        isRefined = _ref2.isRefined;
    return '\n    <option\n      value="' + value + '"\n      ' + (isRefined ? 'selected' : '') + '\n    >\n      ' + label + '\n    </option>\n  ';
  });

  containerNode.find('select').html(itemsHTML);

  containerNode.find('select').off('change').on('change', function (e) {
    refine(e.target.value);
  });
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectHitsPerPage(renderFn);