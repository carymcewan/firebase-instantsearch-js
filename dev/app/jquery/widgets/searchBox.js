'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var query = _ref.query,
      refine = _ref.refine,
      inputNode = _ref.widgetParams.inputNode;

  if (isFirstRendering) {
    inputNode.on('keyup', function () {
      return refine(inputNode.val());
    });
    inputNode.val(query);
  }
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectSearchBox(renderFn);