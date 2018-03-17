'use strict';

var _urlSync = require('../url-sync.js');

var _urlSync2 = _interopRequireDefault(_urlSync);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchParameters = _algoliasearchHelper2.default.SearchParameters;

jest.useFakeTimers();

var makeTestUrlUtils = function makeTestUrlUtils() {
  return {
    url: '',
    lastQs: '',
    onpopstate: function onpopstate() /* cb */{
      // window.addEventListener('popstate', cb);
    },
    pushState: function pushState(qs /* , {getHistoryState} */) {
      this.lastQs = qs;
      // window.history.pushState(getHistoryState(), '', getFullURL(this.createURL(qs)));
    },
    createURL: function createURL(qs) {
      return qs;
    },
    readUrl: function readUrl() {
      // return window.location.search.slice(1);
      return this.url;
    }
  };
};

describe('urlSync mechanics', function () {
  test('Generates urls on change', function () {
    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
    var urlUtils = makeTestUrlUtils();
    var urlSyncWidget = (0, _urlSync2.default)({ urlUtils: urlUtils, threshold: 0 });
    urlSyncWidget.init({ state: SearchParameters.make({}) });
    urlSyncWidget.render({ helper: helper, state: helper.state });

    expect(urlUtils.lastQs).toEqual('');
    helper.setQuery('query');
    expect(urlUtils.lastQs).toEqual('');

    jest.runOnlyPendingTimers();

    expect(urlUtils.lastQs).toMatchSnapshot();
  });
  test('Generated urls should not contain a version', function () {
    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
    var urlUtils = makeTestUrlUtils();
    var urlSyncWidget = (0, _urlSync2.default)({ urlUtils: urlUtils, threshold: 0 });
    urlSyncWidget.init({ state: SearchParameters.make({}) });
    urlSyncWidget.render({ helper: helper, state: helper.state });
    helper.setQuery('query');

    jest.runOnlyPendingTimers();

    expect(urlUtils.lastQs).not.toEqual(expect.stringContaining('is_v'));
  });
  test('updates the URL during the first rendering if it has change since the initial configuration', function () {
    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
    var urlUtils = makeTestUrlUtils();
    var urlSyncWidget = (0, _urlSync2.default)({ urlUtils: urlUtils, threshold: 0 });
    urlSyncWidget.init({ state: SearchParameters.make({}) });

    // In this scenario, there should have been a search here
    // but it was prevented by a search function
    helper.setQuery('query');
    // the change even is setup at the first rendering
    urlSyncWidget.render({ helper: helper, state: helper.state });

    // because the state has changed before the first rendering,
    // we expect the URL to be updated
    jest.runOnlyPendingTimers();
    expect(urlUtils.lastQs).toMatchSnapshot();
  });
});