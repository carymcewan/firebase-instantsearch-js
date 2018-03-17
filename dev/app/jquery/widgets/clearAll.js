'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var refine = _ref.refine,
      hasRefinements = _ref.hasRefinements,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    var markup = window.$('<button id="custom-clear-all">Clear All</button>');
    containerNode.append(markup);

    markup.on('click', function (e) {
      e.preventDefault();
      refine();
    });
  }
  var clearAllCTA = containerNode.find('#custom-clear-all');

  // disable button
  clearAllCTA.attr('disabled', !hasRefinements);
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectClearAll(renderFn);