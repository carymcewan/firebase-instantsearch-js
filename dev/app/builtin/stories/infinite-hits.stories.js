'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('InfiniteHits'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.infiniteHits({
      container: container,
      showMoreLabel: 'Show more',
      templates: {
        item: '{{name}}'
      }
    }));
  })).add('with custom css classes', (0, _wrapWithHits.wrapWithHits)(function (container) {
    var style = window.document.createElement('style');
    window.document.head.appendChild(style);
    style.sheet.insertRule('.button button{border: 1px solid black; background: #fff;}');

    window.search.addWidget(_index2.default.widgets.infiniteHits({
      container: container,
      showMoreLabel: 'Show more',
      cssClasses: {
        showmore: 'button'
      },
      templates: {
        item: '{{name}}'
      }
    }));
  }));
};