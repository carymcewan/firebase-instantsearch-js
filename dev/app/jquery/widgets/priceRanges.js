'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable import/default */


var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLabel = function getLabel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      from = _ref.from,
      to = _ref.to;

  if (to === undefined) return '\u2265 $' + from;
  if (from === undefined) return '\u2264 $' + to;
  return '$' + from + ' - $' + to;
};

// Available price ranges for results
// ----------------------------------
var renderList = function renderList(_ref2) {
  var containerNode = _ref2.containerNode,
      items = _ref2.items,
      refine = _ref2.refine;

  containerNode.find('ul > li').each(function () {
    window.$(this).off();
  });

  var list = items.map(function (item) {
    return '\n    <li class="facet-value">\n      <a href="' + item.url + '">\n        ' + getLabel(item) + '\n      </a>\n    </li>\n  ';
  });

  containerNode.find('ul').html(list);

  containerNode.find('ul > li').each(function (index) {
    window.$(this).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var _items$index = items[index],
          from = _items$index.from,
          to = _items$index.to;

      refine({ from: from, to: to });
    });
  });
};

// Custom values form
// ------------------
var renderForm = function renderForm(_ref3) {
  var containerNode = _ref3.containerNode,
      currentRefinement = _ref3.currentRefinement;

  var _ref4 = currentRefinement || {},
      from = _ref4.from,
      to = _ref4.to;

  containerNode.find('form').html('\n    <label>\n      <span>$ </span>\n      <input\n        type="number"\n        class="ais-price-ranges--input fixed-input-sm"\n        ' + (from ? 'value="' + from + '"' : '') + '\n      />\n    </label>\n\n    <span> to </span>\n\n    <label>\n      <span>$ </span>\n      <input\n        type="number"\n        class="ais-price-ranges--input fixed-input-sm"\n        ' + (to ? 'value="' + to + '"' : '') + '\n      />\n    </label>\n\n    <button\n      type="submit"\n      class="btn btn-default btn-sm"\n    >\n      Go\n    </button>\n  ');
};

var handleFormSubmit = function handleFormSubmit(_ref5) {
  var refine = _ref5.refine,
      containerNode = _ref5.containerNode;
  return function (e) {
    e.preventDefault();

    var _containerNode$find = containerNode.find('input[type="number"]'),
        _containerNode$find2 = _slicedToArray(_containerNode$find, 2),
        fromInputValue = _containerNode$find2[0].value,
        toInputValue = _containerNode$find2[1].value;

    var from = !isNaN(parseFloat(fromInputValue)) ? parseFloat(fromInputValue) : undefined;
    var to = !isNaN(parseFloat(toInputValue)) ? parseFloat(toInputValue) : undefined;

    if (from || to) refine({ from: from, to: to });
  };
};

var renderFn = function renderFn(_ref6, isFirstRendering) {
  var items = _ref6.items,
      refine = _ref6.refine,
      currentRefinement = _ref6.currentRefinement,
      _ref6$widgetParams = _ref6.widgetParams,
      containerNode = _ref6$widgetParams.containerNode,
      _ref6$widgetParams$ti = _ref6$widgetParams.title,
      title = _ref6$widgetParams$ti === undefined ? 'Price ranges' : _ref6$widgetParams$ti;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">' + title + '</div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;"></ul>\n      <form class="ais-price-ranges"></form>\n    ';
    containerNode.append(markup);

    // bind form action on first render
    containerNode.find('form').on('submit', handleFormSubmit({ refine: refine, containerNode: containerNode }));
  }

  renderList({ containerNode: containerNode, items: items, refine: refine });
  renderForm({ containerNode: containerNode, currentRefinement: currentRefinement, refine: refine });
};

exports.default = _index2.default.connectors.connectPriceRanges(renderFn);