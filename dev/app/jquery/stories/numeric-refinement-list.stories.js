'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

var _index = require('../widgets/index.js');

var widgets = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var stories = (0, _devNovel.storiesOf)('NumericRefinementList');

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHitsAndJquery)(function (containerNode) {
    window.search.addWidget(widgets.numericRefinementList({
      containerNode: containerNode,
      attributeName: 'price',
      operator: 'or',
      options: [{ name: 'All' }, { end: 4, name: 'less than 4' }, { start: 4, end: 4, name: '4' }, { start: 5, end: 10, name: 'between 5 and 10' }, { start: 10, name: 'more than 10' }]
    }));
  }));
};