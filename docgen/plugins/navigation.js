'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (files, metalsmith, done) {
    var categories = {};

    // First we scann all the HTML files to retrieve all the related documents based
    // on the category attribute in the metadata
    (0, _lodash.forEach)(files, function (data, path) {
      if (!path.match(/\.html$/) || data.tocVisibility === false) return;
      var category = data.category || 'other';
      categories[category] = categories[category] || [];
      categories[category].push({
        path: path,
        title: data.title,
        navWeight: data.navWeight,
        metadata: data
      });
    });

    // Then we go through all the files again to attach in the navigation attribute
    // all the related documents
    (0, _lodash.forEach)(files, function (data, path) {
      if (!path.match(/\.html$/)) return;
      var category = data.category || 'other';
      // The navigation is sorted by weight first. A document with weigth is always more important
      // than one without.
      // Then navigation is sorted by title.
      data.navigation = categories[category].sort(function (a, b) {
        if (a.title && b.title && a.navWeight === b.navWeight) {
          return a.title.localeCompare(b.title);
        } else {
          return b.navWeight - a.navWeight;
        }
      });
      data.navPath = path;
    });

    done();
  };
};

var _lodash = require('lodash');