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
    var containingForm = document.createElement('form');
    node.parentNode.appendChild(containingForm);
    node.placeholder = widgetParams.placeholder;

    containingForm.appendChild(node);

    containingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      refine(node.value);
    });
  }
} /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectSearchBox(render);