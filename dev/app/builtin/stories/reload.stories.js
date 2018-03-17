'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Refresh'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    var button = document.createElement('button');
    button.addEventListener('click', function () {
      return window.search.refresh();
    });
    button.innerHTML = 'Refresh InstantSearch';
    var searchBoxContainer = document.createElement('div');
    window.search.addWidget(_index2.default.widgets.searchBox({ container: searchBoxContainer }));
    container.appendChild(button);
    container.appendChild(searchBoxContainer);
  }));
};