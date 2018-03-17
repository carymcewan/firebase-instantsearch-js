'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapWithHitsAndJquery = exports.wrapWithHits = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _devNovel = require('dev-novel');

var _index = require('../../../index.js');

var _index2 = _interopRequireDefault(_index);

var _item = require('./item.html');

var _item2 = _interopRequireDefault(_item);

var _noResults = require('./no-results.html');

var _noResults2 = _interopRequireDefault(_noResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable import/default */

var wrapWithHits = function wrapWithHits(initWidget) {
  var instantSearchConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (container) {
    var _instantSearchConfig$ = instantSearchConfig.appId,
        appId = _instantSearchConfig$ === undefined ? 'latency' : _instantSearchConfig$,
        _instantSearchConfig$2 = instantSearchConfig.apiKey,
        apiKey = _instantSearchConfig$2 === undefined ? '6be0576ff61c053d5f9a3225e2a90f76' : _instantSearchConfig$2,
        _instantSearchConfig$3 = instantSearchConfig.indexName,
        indexName = _instantSearchConfig$3 === undefined ? 'instant_search' : _instantSearchConfig$3,
        _instantSearchConfig$4 = instantSearchConfig.searchParameters,
        searchParameters = _instantSearchConfig$4 === undefined ? {} : _instantSearchConfig$4,
        otherInstantSearchConfig = _objectWithoutProperties(instantSearchConfig, ['appId', 'apiKey', 'indexName', 'searchParameters']);

    var urlLogger = (0, _devNovel.action)('[URL sync] pushstate: query string');
    window.search = (0, _index2.default)(_extends({
      appId: appId,
      apiKey: apiKey,
      indexName: indexName,
      searchParameters: _extends({
        hitsPerPage: 3
      }, searchParameters),
      urlSync: {
        urlUtils: {
          onpopstate: function onpopstate() {},
          pushState: function pushState(qs) {
            urlLogger(this.createURL(qs));
          },
          createURL: function createURL(qs) {
            return qs;
          },
          readUrl: function readUrl() {
            return '';
          }
        }
      }
    }, otherInstantSearchConfig));

    container.innerHTML = '\n    <div id="widget-display"></div>\n    <div id="results-display">\n      <div id="results-search-box-container"></div>\n      <div id="results-hits-container"></div>\n      <div id="results-pagination-container"></div>\n    </div>\n  ';

    window.search.addWidget(_index2.default.widgets.searchBox({
      container: '#results-search-box-container',
      placeholder: 'Search into our furnitures',
      poweredBy: false,
      autofocus: false
    }));

    window.search.addWidget(_index2.default.widgets.hits({
      container: '#results-hits-container',
      templates: {
        empty: _noResults2.default,
        item: _item2.default
      }
    }));

    window.search.addWidget(_index2.default.widgets.pagination({
      container: '#results-pagination-container',
      maxPages: 20
    }));

    if (initWidget.length === 1) {
      initWidget(window.document.getElementById('widget-display'));

      return window.search.start();
    }

    return initWidget(window.document.getElementById('widget-display'), function () {
      window.search.start();
    });
  };
};

exports.wrapWithHits = wrapWithHits;
var wrapWithHitsAndJquery = exports.wrapWithHitsAndJquery = function wrapWithHitsAndJquery(fn) {
  return wrapWithHits(function (container) {
    return fn(window.$(container));
  });
};