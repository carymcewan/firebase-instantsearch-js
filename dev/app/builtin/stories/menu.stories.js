'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Menu'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.menu({
      container: container,
      attributeName: 'categories'
    }));
  })).add('with show more and header', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.menu({
      container: container,
      attributeName: 'categories',
      limit: 3,
      showMore: {
        templates: {
          active: '<button>Show less</button>',
          inactive: '<button>Show more</button>'
        },
        limit: 10
      },
      templates: {
        header: 'Categories (menu widget)'
      }
    }));
  })).add('as a Select DOM element', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.menuSelect({
      container: container,
      attributeName: 'categories',
      limit: 10
    }));
  }));
};