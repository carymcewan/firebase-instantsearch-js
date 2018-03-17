'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var items = _ref.items,
      createURL = _ref.createURL,
      refine = _ref.refine,
      _ref$widgetParams = _ref.widgetParams,
      containerNode = _ref$widgetParams.containerNode,
      _ref$widgetParams$tit = _ref$widgetParams.title,
      title = _ref$widgetParams$tit === undefined ? 'Rating' : _ref$widgetParams$tit;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">' + title + '</div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;"></ul>\n    ';
    containerNode.append(markup);
  }

  containerNode.find('li[data-refine-value]').each(function () {
    window.$(this).off('click');
  });

  var list = items.map(function (item) {
    return '\n    <li data-refine-value="' + item.value + '"\n      ' + (item.isRefined ? 'style="font-weight: bold;"' : '') + '\n    >\n      <a href="' + createURL(item.value) + '">\n        ' + item.stars.map(function (star) {
      return '<span class="ais-star-rating--star' + (star === false ? '__empty' : '') + '"></span>';
    }).join('') + '\n\n        & up (' + item.count + ')\n      </a>\n    </li>\n  ';
  });

  containerNode.find('ul').html(list);

  containerNode.find('li[data-refine-value]').each(function () {
    var _this = this;

    window.$(this).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      refine(window.$(_this).data('refine-value'));
    });
  });
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectStarRating(renderFn);