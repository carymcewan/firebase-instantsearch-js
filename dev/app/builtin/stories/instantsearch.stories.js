'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

/* eslint-disable import/default */

var stories = (0, _devNovel.storiesOf)('Instantsearch');

exports.default = function () {
  stories.add('With searchfunction that prevent search', (0, _wrapWithHits.wrapWithHits)(function () {}, {
    searchFunction: function searchFunction(helper) {
      var query = helper.state.query;
      if (query === '') {
        return;
      }
      helper.search();
    }
  }));
};