'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectHits = require('../connectHits.js');

var _connectHits2 = _interopRequireDefault(_connectHits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectHits', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHits2.default)(rendering);
    var widget = makeWidget({ escapeHits: true });

    expect(widget.getConfiguration()).toEqual({
      highlightPreTag: '__ais-highlight__',
      highlightPostTag: '__/ais-highlight__'
    });

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {});
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    // test that rendering has been called during init with isFirstRendering = true
    expect(rendering.callCount).toBe(1);
    // test if isFirstRendering is true during init
    expect(rendering.lastCall.args[1]).toBe(true);
    expect(rendering.lastCall.args[0].widgetParams).toEqual({
      escapeHits: true
    });

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    // test that rendering has been called during init with isFirstRendering = false
    expect(rendering.callCount).toBe(2);
    expect(rendering.lastCall.args[1]).toBe(false);
    expect(rendering.lastCall.args[0].widgetParams).toEqual({
      escapeHits: true
    });
  });

  it('Provides the hits and the whole results', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHits2.default)(rendering);
    var widget = makeWidget({});

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {});
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.hits).toEqual([]);
    expect(firstRenderingOptions.results).toBe(undefined);

    var hits = [{ fake: 'data' }, { sample: 'infos' }];

    var results = new SearchResults(helper.state, [{ hits: [].concat(hits) }]);
    widget.render({
      results: results,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.hits).toEqual(hits);
    expect(secondRenderingOptions.results).toEqual(results);
  });

  it('escape highlight properties if requested', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHits2.default)(rendering);
    var widget = makeWidget({ escapeHits: true });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {});
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.hits).toEqual([]);
    expect(firstRenderingOptions.results).toBe(undefined);

    var hits = [{
      _highlightResult: {
        foobar: {
          value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
        }
      }
    }];

    var results = new SearchResults(helper.state, [{ hits: hits }]);
    widget.render({
      results: results,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var escapedHits = [{
      _highlightResult: {
        foobar: {
          value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
        }
      }
    }];

    escapedHits.__escaped = true;

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.hits).toEqual(escapedHits);
    expect(secondRenderingOptions.results).toEqual(results);
  });
});