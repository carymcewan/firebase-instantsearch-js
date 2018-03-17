'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = builder;

var _metalsmith = require('metalsmith');

var _metalsmith2 = _interopRequireDefault(_metalsmith);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
function builder(_ref, cb) {
  var _ref$clean = _ref.clean,
      clean = _ref$clean === undefined ? true : _ref$clean,
      middlewares = _ref.middlewares;

  console.time('metalsmith build');
  // default source directory is join(__dirname, 'src');
  // https://github.com/metalsmith/metalsmith#sourcepath
  (0, _metalsmith2.default)(__dirname).metadata(_config2.default).clean(clean).destination(_config2.default.docsDist).use(middlewares).build(function (err) {
    console.timeEnd('metalsmith build');
    cb(err);
  });
}