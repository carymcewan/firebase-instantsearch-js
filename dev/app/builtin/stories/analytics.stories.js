'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Analytics'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    var description = document.createElement('p');
    description.innerText = 'Search for something, look into Action Logger';
    container.appendChild(description);

    window.search.addWidget(_index2.default.widgets.analytics({
      pushFunction: function pushFunction(formattedParameters, state, results) {
        (0, _devNovel.action)('pushFunction[formattedParameters]')(formattedParameters);
        (0, _devNovel.action)('pushFunction[state]')(state);
        (0, _devNovel.action)('pushFunction[results]')(results);
      },

      triggerOnUIInteraction: true,
      pushInitialSearch: false
    }));
  }));
};