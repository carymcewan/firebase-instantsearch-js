'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var nbHits = _ref.nbHits,
      processingTimeMS = _ref.processingTimeMS,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) return;
  containerNode.html(nbHits + ' results found in ' + processingTimeMS + 'ms');
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectStats(renderFn);