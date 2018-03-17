'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ghPages = require('gh-pages');

var _ghPages2 = _interopRequireDefault(_ghPages);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var basePath = (0, _path.join)(__dirname, '../../docs');

_ghPages2.default.clean();

var config = {
  silent: true,
  logger: function logger(msg) {
    return console.log(msg);
  },
  only: ['**/*', '!v1/**/*', '!v1']
};

if (process.env.CI === 'true') {
  _ghPages2.default.publish(basePath, _extends({}, config, {
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/algolia/instantsearch.js.git'
  }), end);
} else {
  _ghPages2.default.publish(basePath, config, end);
}

function end(err) {
  if (err) {
    throw err;
  } else {
    console.log('published gh-pages');
  }
}