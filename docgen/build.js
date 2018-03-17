'use strict';

var _builder = require('./builder.js');

var _builder2 = _interopRequireDefault(_builder);

var _middlewares = require('./middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _builder2.default)({
  middlewares: _middlewares.build
}, function (err) {
  if (err) {
    throw err;
  }
});