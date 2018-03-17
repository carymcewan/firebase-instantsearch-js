'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(_ref, isFirstRendering) {
  var refine = _ref.refine,
      widgetParams = _ref.widgetParams;
  var node = widgetParams.node;

  if (isFirstRendering) {
    node.placeholder = widgetParams.placeholder;
    node.addEventListener('input', function (e) {
      return refine(e.target.value);
    });
  }
} /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectSearchBox(render);