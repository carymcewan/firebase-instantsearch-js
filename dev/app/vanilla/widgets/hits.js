'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['<div>\n    ', '\n  </div>'], ['<div>\n    ', '\n  </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<h4></h4>'], ['<h4></h4>']),
    _templateObject3 = _taggedTemplateLiteral(['<p></p>'], ['<p></p>']),
    _templateObject4 = _taggedTemplateLiteral(['\n        <div class="ais-hits--item">\n          <div class="hit" id="hit-bel-', '">\n            <div class="media">\n              <a class="pull-left" href="', '">\n                <img class="media-object" src="', '">\n              </a>\n              <div class="media-body">\n                <h3 class="pull-right text-right text-info">$', '</h3>\n                <h4>', '</h4>\n                <p>', '</p>\n                ', '\n              </div>\n            </div>\n            <a href="#">Go back to top</a>\n          </div>\n        </div>'], ['\n        <div class="ais-hits--item">\n          <div class="hit" id="hit-bel-', '">\n            <div class="media">\n              <a class="pull-left" href="', '">\n                <img class="media-object" src="', '">\n              </a>\n              <div class="media-body">\n                <h3 class="pull-right text-right text-info">$', '</h3>\n                <h4>', '</h4>\n                <p>', '</p>\n                ', '\n              </div>\n            </div>\n            <a href="#">Go back to top</a>\n          </div>\n        </div>']),
    _templateObject5 = _taggedTemplateLiteral(['<span class="badge pull-right">Free Shipping</span>'], ['<span class="badge pull-right">Free Shipping</span>']);

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

var _bel = require('bel');

var _bel2 = _interopRequireDefault(_bel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } /* eslint-disable import/default */


function render(_ref) {
  var hits = _ref.hits,
      containerNode = _ref.widgetParams.containerNode;

  var content = (0, _bel2.default)(_templateObject, hits.map(function (hit) {
    var title = (0, _bel2.default)(_templateObject2);
    title.innerHTML = hit._highlightResult.name.value;
    var description = (0, _bel2.default)(_templateObject3);
    description.innerHTML = hit._highlightResult.description.value;

    return (0, _bel2.default)(_templateObject4, hit.objectID, hit.url, hit.image, hit.price, title, description, hit.free_shipping ? (0, _bel2.default)(_templateObject5) : '');
  }));

  containerNode.innerText = '';
  containerNode.appendChild(content);
}

exports.default = _index2.default.connectors.connectHits(render);