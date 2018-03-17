'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('searchBox', function () {
  describe('when there is no query', function () {
    beforeEach(function () {
      return _utils.searchBox.clear();
    });

    it('input is empty', function () {
      return (0, _expect2.default)(_utils.searchBox.get()).toBe('');
    });

    it('triggers an empty search', function () {
      (0, _expect2.default)(browser.getText('#hits')).not.toContain('MP3');
      (0, _utils.prepareScreenshot)();
      browser.checkDocument({
        hide: ['.ais-stats--body'] // Flaky X ms information.
      });
    });
  });

  describe('when there is a query', function () {
    beforeEach(function () {
      return _utils.searchBox.set('mp3');
    });

    it('fills the input', function () {
      return (0, _expect2.default)(_utils.searchBox.get()).toBe('mp3');
    });

    it('triggers a new search', function () {
      (0, _expect2.default)(browser.getText('#hits')).toContain('MP3');
      (0, _utils.prepareScreenshot)();
      browser.checkDocument({
        hide: ['.ais-stats--body'] // Flaky X ms information.
      });
    });
  });
});