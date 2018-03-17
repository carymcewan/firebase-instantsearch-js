'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mversion = require('mversion');

var _mversion2 = _interopRequireDefault(_mversion);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _version = require('../src/lib/version.js');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!process.env.VERSION) {
  throw new Error('release: Usage is VERSION=MAJOR.MINOR.PATCH npm run release');
} /* eslint-disable no-console */

var newVersion = process.env.VERSION;

if (!_semver2.default.valid(newVersion)) {
  throw new Error('release: Provided new version (' + newVersion + ') is not a valid version per semver');
}

if (_semver2.default.gte(_version2.default, newVersion)) {
  throw new Error('release:\n    Provided new version is not higher than current version (' + newVersion + ' <= ' + _version2.default + ')');
}

console.log('Releasing ' + newVersion);

console.log('..Updating src/lib/version.js');

var versionFile = _path2.default.join(__dirname, '../src/lib/version.js');
var newContent = 'export default \'' + newVersion + '\';\n';
_fs2.default.writeFileSync(versionFile, newContent);

console.log('..Updating package.json, npm-shrinwrap.json');

_mversion2.default.update(newVersion);