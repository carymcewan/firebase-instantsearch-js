'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('SearchBox'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true
    }));
  })).add('display loading indicator', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true,
      loadingIndicator: true
    }));
  })).add('display loading indicator with a template', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true,
      loadingIndicator: {
        template: '⚡️'
      }
    }));
  })).add('with custom templates', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true,
      magnifier: {
        template: '<div class="ais-search-box--magnifier">🔍</div>'
      },
      reset: {
        template: '<div class="ais-search-box--reset">✖️</div>'
      },
      templates: {
        poweredBy: 'Algolia'
      }
    }));
  })).add('search on enter', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: container,
      placeholder: 'Search for products',
      poweredBy: true,
      searchOnEnterKeyPressOnly: true
    }));
  })).add('input with initial value', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '<input value="ok"/>';
    var input = container.firstChild;
    container.appendChild(input);
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: input
    }));
  })).add('with a provided input', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '<input/>';
    var input = container.firstChild;
    container.appendChild(input);
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: input
    }));
  })).add('with a provided input and the loading indicator', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '<input/>';
    var input = container.firstChild;
    container.appendChild(input);
    window.search.addWidget(_index2.default.widgets.searchBox({
      container: input,
      loadingIndicator: true
    }));
  }));
};