'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Hits'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hits({ container: container }));
  })).add('with highlighted array', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hits({
      container: container,
      escapeHits: true,
      templates: {
        item: '\n                  <div class="hit" id="hit-{{objectID}}">\n                    <div class="hit-content">\n                      <div>\n                        <span>{{{_highlightResult.name.value}}}</span>\n                        <span>${{price}}</span>\n                        <span>{{rating}} stars</span>\n                      </div>\n                      <div class="hit-type">\n                        {{{_highlightResult.type.value}}}\n                      </div>\n                      <div class="hit-description">\n                        {{{_highlightResult.description.value}}}\n                      </div>\n                      <div class="hit-tags">\n                      {{#_highlightResult.tags}}\n                        <span>{{{value}}}</span>\n                      {{/_highlightResult.tags}}\n                      </div>\n                    </div>\n                  </div>\n                '
      }
    }));
  }, {
    appId: 'KY4PR9ORUL',
    apiKey: 'a5ca312adab3b79e14054154efa00b37',
    indexName: 'highlight_array'
  }));
};