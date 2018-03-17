'use strict';

var _chokidar = require('chokidar');

var _devServer = require('./devServer.js');

var _devServer2 = _interopRequireDefault(_devServer);

var _builder = require('./builder.js');

var _builder2 = _interopRequireDefault(_builder);

var _middlewares = require('./middlewares');

var _path = require('./path.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// we build once at start
(0, _builder2.default)({ middlewares: _middlewares.start }, function (err) {
  if (err) {
    throw err;
  }

  // watch and serve docs/ (browser sync)
  (0, _devServer2.default)();
});

// then we watch and rebuild
(0, _chokidar.watch)([(0, _path.rootPath)('docgen/assets/'), (0, _path.rootPath)('docgen/src/**/*'), (0, _path.rootPath)('docgen/layouts/**/*.pug'), (0, _path.rootPath)('src/**/*.js')], {
  ignoreInitial: true,
  ignored: /assets\/js\/(.*)?\.js$/
}).on('all', function (event, filePath) {
  // filter out plugins we dont need on some files changes
  // example: remove `documentationjs` when no src/ files changed.
  var isSrcFileChange = filePath.includes('src/') && !filePath.includes('docgen');
  var isSassFile = filePath.includes('docgen') && /^[^_.].*\.s[ac]ss/.test(filePath);
  var isMarkdownOrPugFile = filePath.includes('docgen') && /\.md$|\.pug$/.test(filePath);

  var nextMiddlewares = _middlewares.start.filter(function (fn) {
    return isSrcFileChange || fn.name !== 'documentationjs';
  }).filter(function (fn) {
    return isMarkdownOrPugFile || fn.name !== 'markdown';
  }).filter(function (fn) {
    return isSassFile || fn.name !== 'bound compileSass';
  }).filter(function (fn) {
    return isSassFile || fn.name !== 'sassAutoprefixer';
  });

  (0, _builder2.default)({ clean: false, middlewares: nextMiddlewares }, function (err) {
    if (err) {
      if (err.message.includes('[metalsmith-sass] Error: Invalid CSS')) {
        console.warn(err.message);
      } else {
        throw err;
      }
    }
  });
}).on('error', function (err) {
  throw err;
});