'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sassAutoprefixer;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssScss = require('postcss-scss');

var _postcssScss2 = _interopRequireDefault(_postcssScss);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sassAutoprefixer(files, metalsmith, done) {
  var processor = (0, _postcss2.default)([_autoprefixer2.default]);
  Object.keys(files).filter(function (file) {
    return (/\.css$/.test(file)
    );
  }).forEach(function (file) {
    var originalContent = files[file].contents.toString();
    var autoprefixedContent = processor.process(originalContent, { syntax: _postcssScss2.default }).css;
    files[file].contents = new Buffer(autoprefixedContent);
    files[file].stats.mtime = new Date().toISOString();
  });

  done();
}