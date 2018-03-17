'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

var _index = require('../widgets/index.js');

var widgets = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var stories = (0, _devNovel.storiesOf)('NumericSelector');

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHitsAndJquery)(function (containerNode) {
    window.search.addWidget(widgets.numericSelector({
      containerNode: containerNode,
      operator: '>=',
      attributeName: 'popularity',
      options: [{ label: 'Default', value: 0 }, { label: 'Top 10', value: 9991 }, { label: 'Top 100', value: 9901 }, { label: 'Top 500', value: 9501 }]
    }));
  }));
};