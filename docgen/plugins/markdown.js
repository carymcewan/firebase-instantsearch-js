'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = markdown;

var _path = require('path');

var _mdRenderer = require('../mdRenderer');

var _mdRenderer2 = _interopRequireDefault(_mdRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isMarkdown = function isMarkdown(filepath) {
  return (/\.md|\.markdown/.test((0, _path.extname)(filepath))
  );
};

function markdown(files, metalsmith, done) {
  Object.keys(files).forEach(function (file) {
    if (!isMarkdown(file)) return;
    var data = files[file];
    var dir = (0, _path.dirname)(file);
    var html = (0, _path.basename)(file, (0, _path.extname)(file)) + '.html';
    if (dir !== '.') html = dir + '/' + html;
    var str = _mdRenderer2.default.render(data.contents.toString(), { path: html });
    data.contents = new Buffer(str);
    delete files[file];
    files[html] = data;
  });

  done();
}