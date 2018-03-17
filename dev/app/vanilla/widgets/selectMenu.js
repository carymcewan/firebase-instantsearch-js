'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(_ref, isFirstRendering) {
  var items = _ref.items,
      refine = _ref.refine,
      _ref$widgetParams = _ref.widgetParams,
      containerNode = _ref$widgetParams.containerNode,
      title = _ref$widgetParams.title;

  var select = void 0;
  if (isFirstRendering) {
    var header = document.createElement('div');
    header.innerText = title;
    containerNode.appendChild(header);
    select = document.createElement('select');

    select.addEventListener('change', function (e) {
      return refine(e.target.value);
    });

    containerNode.appendChild(select);
  } else {
    select = containerNode.querySelector('select');
  }

  var options = items.map(function (item) {
    var option = document.createElement('option');

    option.innerText = item.label + ' ' + item.count;
    option.value = item.value;
    option.selected = item.isRefined;

    return option;
  });

  select.textContent = '';
  options.forEach(function (el) {
    return select.appendChild(el);
  });
} /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectMenu(render);