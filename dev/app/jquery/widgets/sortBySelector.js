'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var options = _ref.options,
      refine = _ref.refine,
      currentRefinement = _ref.currentRefinement,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    containerNode.append('<select></select>');
    containerNode.find('select').on('change', function (_ref2) {
      var value = _ref2.target.value;
      return refine(value);
    });
  }

  var optionsHTML = options.map(function (_ref3) {
    var label = _ref3.label,
        value = _ref3.value;
    return '\n    <option\n      value="' + value + '"\n      ' + (currentRefinement === value ? 'selected' : '') + '\n    >\n      ' + label + '\n    </option>\n  ';
  });

  containerNode.find('select').html(optionsHTML);
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectSortBySelector(renderFn);