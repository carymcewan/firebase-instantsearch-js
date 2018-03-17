'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderFn = function renderFn(_ref, isFirstRendering) {
  var nbPages = _ref.nbPages,
      pages = _ref.pages,
      createURL = _ref.createURL,
      refine = _ref.refine,
      currentRefinement = _ref.currentRefinement,
      containerNode = _ref.widgetParams.containerNode;

  if (isFirstRendering) {
    var markup = '\n      <div class="facet-title">Custom pagination</div>\n      <ul class="pagination"></ul>\n    ';
    containerNode.append(markup);
  }

  // remove event listeners before replacing markup
  containerNode.find('a[data-page]').each(function () {
    window.$(this).off('click');
  });

  if (nbPages > 0) {
    containerNode.find('ul.pagination').html(pages.map(function (page) {
      return '\n            <li ' + (page === currentRefinement ? 'class="active"' : '') + '>\n              <a\n                href="' + createURL(page) + '"\n                data-page=' + page + '\n              >\n                ' + (page + 1) + '\n              </a>\n            </li>\n          ';
    }).join(''));

    containerNode.find('a[data-page]').each(function () {
      var _this = this;

      window.$(this).on('click', function (e) {
        e.preventDefault();
        refine(window.$(_this).data('page'));
      });
    });
  }
}; /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectPagination(renderFn);