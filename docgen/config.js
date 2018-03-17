'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('./path');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var algoliaComponents = require('algolia-frontend-components');
var fs = require('fs');

var prod = process.env.NODE_ENV === 'production';

var content = JSON.parse(fs.readFileSync('./src/data/communityHeader.json', 'utf8').toString());
var headerAlgoliaLogo = fs.readFileSync('assets/img/algolia-logo-darkbg.svg', 'utf8').toString();
var headerCommunityLogo = fs.readFileSync('assets/img/algolia-community-dark.svg', 'utf8').toString();
var header = algoliaComponents.communityHeader(content, {
  algoliaLogo: headerAlgoliaLogo,
  communityLogo: headerCommunityLogo
});

exports.default = {
  docsDist: (0, _path.rootPath)('docs'),
  publicPath: prod ? '/instantsearch.js/v2/' : '/v2/',
  header: header,
  pkg: _package2.default
};