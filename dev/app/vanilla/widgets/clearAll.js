'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _index2.default.connectors.connectClearAll(render); /* eslint-disable import/default */

function render(_ref, isFirstRendering) {
  var refine = _ref.refine,
      widgetParams = _ref.widgetParams;

  var button = void 0;
  if (isFirstRendering) {
    button = document.createElement('button');
    button.innerText = 'clear';
    widgetParams.containerNode.appendChild(button);
    button.addEventListener('click', function () {
      return refine();
    });
  }
}