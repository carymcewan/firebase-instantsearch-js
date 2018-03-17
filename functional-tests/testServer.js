'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = void 0;

var loadNonMinified = function loadNonMinified() {
  return function (req, res, next) {
    var buildType = /^\/(.*)?\.min\.js$/;
    var minifiedJavaScriptMatch = buildType.exec(req.path);

    if (minifiedJavaScriptMatch) {
      res.redirect(minifiedJavaScriptMatch[1] + '.js');
      return;
    }

    next();
  };
};

exports.default = {
  start: function start() {
    return new Promise(function (resolve, reject) {
      var app = (0, _express2.default)();
      app.use((0, _compression2.default)());

      // in npm run test:functional:dev mode we only watch and compile instantsearch.js
      if (process.env.CI !== 'true') {
        app.use(loadNonMinified());
      }

      app.use(_express2.default.static(_path2.default.join(__dirname, 'app')));
      app.use(_express2.default.static(_path2.default.join(__dirname, '..', 'dist')));
      server = app.listen(process.env.PORT || 9000);

      server.once('listening', function () {
        return resolve(server);
      });
      server.once('error', reject);
    });
  },
  stop: function stop() {
    server.close();
  }
};