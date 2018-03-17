'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (files, metalsmith, done) {
    (0, _lodash.forEach)(files, function (data, path) {
      var appId = data.appId,
          apiKey = data.apiKey,
          indexName = data.indexName;


      if (appId || apiKey || indexName) {
        data.contents = data.contents + ('<script>\n            window.searchConfig = {\n              ' + (appId ? 'appId: \'' + appId + '\',' : '') + '\n              ' + (apiKey ? 'apiKey: \'' + apiKey + '\',' : '') + '\n              ' + (indexName ? 'indexName: \'' + indexName + '\',' : '') + '\n            };\n          </script>').replace(/\s/g, '');
      }
    });

    done();
  };
};

var _lodash = require('lodash');