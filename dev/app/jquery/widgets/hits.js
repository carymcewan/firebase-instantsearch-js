'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref) {
  var hits = _ref.hits,
      containerNode = _ref.widgetParams.containerNode;

  containerNode.html(hits.map(function (hit) {
    return '\n      <div class="hit">\n        <div class="media">\n          <a\n            href="' + hit.url + '"\n            class="pull-left"\n          >\n            <img\n              class="media-object"\n              src="' + hit.image + '"\n            />\n          </a>\n\n          <div class="media-body">\n            <h3 class="pull-right text-right text-info">$' + hit.price + '</h3>\n            <h4>' + hit._highlightResult.name.value + '</h4>\n            <p>' + hit._highlightResult.description.value + '</p>\n\n            ' + (hit.free_shipping ? '<span class="badge pull-right">Free shipping</span>' : '') + '\n          </div>\n        </div>\n      </div>\n    ';
  }));
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectHits(renderFn);