'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _toFactory = require('to-factory');

var _toFactory2 = _interopRequireDefault(_toFactory);

var _InstantSearch = require('./lib/InstantSearch.js');

var _InstantSearch2 = _interopRequireDefault(_InstantSearch);

var _version = require('./lib/version.js');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-enable import/no-unresolved */

// import instantsearch from 'instantsearch.js';
// -> provides instantsearch object without connectors and widgets


/* eslint-disable import/no-unresolved */
/* eslint max-len: 0 */
var instantSearchFactory = Object.assign((0, _toFactory2.default)(_InstantSearch2.default), {
  version: _version2.default,
  createQueryString: _algoliasearchHelper2.default.url.getQueryStringFromState
});

Object.defineProperty(instantSearchFactory, 'widgets', {
  get: function get() {
    throw new ReferenceError('You can\'t access \'instantsearch.widgets\' directly from the ES6 build.\nImport the widgets this way: \'import {SearchBox} from "instantsearch.js/es/widgets"\'');
  }
});

Object.defineProperty(instantSearchFactory, 'connectors', {
  get: function get() {
    throw new ReferenceError('You can\'t access \'instantsearch.connectors\' directly from the ES6 build.\nImport the connectors this way: \'import {connectSearchBox} from "instantsearch.js/es/connectors"\'');
  }
});

exports.default = instantSearchFactory;
