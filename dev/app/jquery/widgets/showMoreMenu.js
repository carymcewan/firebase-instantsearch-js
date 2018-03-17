'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var items = _ref.items,
      refine = _ref.refine,
      createURL = _ref.createURL,
      isShowingMore = _ref.isShowingMore,
      toggleShowMore = _ref.toggleShowMore,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    containerNode.html('\n      <div class="facet-title">Categories (menu with showmore)</div>\n      <ul style="list-style-type: none; margin: 0; padding: 0;" />\n      <button class="btn btn-sm btn-default btn-block" style="margin-top: 10px" />\n    ');
    containerNode.find('button').on('click', function (e) {
      e.preventDefault();
      toggleShowMore();
    });
  }

  // remove event listeners before re-render
  containerNode.find('li[data-refine-value]').each(function () {
    window.$(this).off('click');
  });

  containerNode.find('button').text(isShowingMore ? 'Show less' : 'Show more');

  var itemsHTML = items.map(function (item) {
    return '\n    <li data-refine-value="' + item.value + '">\n      <a href="' + createURL(item.value) + '" class="facet-value clearfix">\n        ' + (item.isRefined ? '<strong>' + item.label + '</strong>' : item.label) + '\n        <span class="facet-count pull-right">' + item.count + '</span>\n      </a>\n    </li>\n  ';
  });

  containerNode.find('ul').html(itemsHTML);

  containerNode.find('li[data-refine-value]').each(function () {
    var _this = this;

    window.$(this).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      refine(window.$(_this).data('refine-value'));
    });
  });
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectMenu(renderFn);