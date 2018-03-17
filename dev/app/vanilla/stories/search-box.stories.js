'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

var _index = require('../widgets/index.js');

var widgets = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var stories = (0, _devNovel.storiesOf)('SearchBox');

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    var input = document.createElement('input');
    container.appendChild(input);

    window.search.addWidget(widgets.searchBox({
      node: input,
      placeholder: 'Search for products'
    }));
  })).add('with enter to search', (0, _wrapWithHits.wrapWithHits)(function (container) {
    var input = document.createElement('input');
    container.appendChild(input);

    window.search.addWidget(widgets.searchBoxReturn({
      node: input,
      placeholder: 'Search for products'
    }));
  }));
};