'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectStarRating = require('../connectStarRating.js');

var _connectStarRating2 = _interopRequireDefault(_connectStarRating);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectStarRating', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectStarRating2.default)(rendering);

    var attributeName = 'grade';
    var widget = makeWidget({
      attributeName: attributeName
    });

    var config = widget.getConfiguration({});
    expect(config).toEqual({
      disjunctiveFacets: [attributeName]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    {
      // should call the rendering once with isFirstRendering to true
      expect(rendering.callCount).toBe(1);
      var isFirstRendering = rendering.lastCall.args[1];
      expect(isFirstRendering).toBe(true);

      // should provide good values for the first rendering
      var _rendering$lastCall$a = rendering.lastCall.args[0],
          items = _rendering$lastCall$a.items,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(items).toEqual([]);
      expect(widgetParams).toEqual({ attributeName: attributeName });
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: _defineProperty({}, attributeName, { 0: 5, 1: 10, 2: 20, 3: 50, 4: 900, 5: 100 })
      }, {}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Should call the rendering a second time, with isFirstRendering to false
      expect(rendering.callCount).toBe(2);
      var _isFirstRendering = rendering.lastCall.args[1];
      expect(_isFirstRendering).toBe(false);

      // should provide good values after the first search
      var _items = rendering.lastCall.args[0].items;

      expect(_items).toEqual([{
        count: 1000,
        isRefined: false,
        name: '4',
        value: '4',
        stars: [true, true, true, true, false]
      }, {
        count: 1050,
        isRefined: false,
        name: '3',
        value: '3',
        stars: [true, true, true, false, false]
      }, {
        count: 1070,
        isRefined: false,
        name: '2',
        value: '2',
        stars: [true, true, false, false, false]
      }, {
        count: 1080,
        isRefined: false,
        name: '1',
        value: '1',
        stars: [true, false, false, false, false]
      }]);
    }
  });

  it('Provides a function to update the index at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectStarRating2.default)(rendering);

    var attributeName = 'grade';
    var widget = makeWidget({
      attributeName: attributeName
    });

    var config = widget.getConfiguration({});

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    {
      // first rendering
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine,
          items = renderOptions.items;

      expect(items).toEqual([]);
      expect(helper.getRefinements(attributeName)).toEqual([]);
      refine('3');
      expect(helper.getRefinements(attributeName)).toEqual([{ type: 'disjunctive', value: '3' }, { type: 'disjunctive', value: '4' }, { type: 'disjunctive', value: '5' }]);
      expect(helper.search.callCount).toBe(1);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: _defineProperty({}, attributeName, { 3: 50, 4: 900, 5: 100 })
      }, {
        facets: _defineProperty({}, attributeName, { 0: 5, 1: 10, 2: 20, 3: 50, 4: 900, 5: 100 })
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine,
          _items2 = _renderOptions.items;

      expect(_items2).toEqual([{
        count: 1000,
        isRefined: false,
        name: '4',
        value: '4',
        stars: [true, true, true, true, false]
      }, {
        count: 1050,
        isRefined: true,
        name: '3',
        value: '3',
        stars: [true, true, true, false, false]
      }, {
        count: 1070,
        isRefined: false,
        name: '2',
        value: '2',
        stars: [true, true, false, false, false]
      }, {
        count: 1080,
        isRefined: false,
        name: '1',
        value: '1',
        stars: [true, false, false, false, false]
      }]);
      expect(helper.getRefinements(attributeName)).toEqual([{ type: 'disjunctive', value: '3' }, { type: 'disjunctive', value: '4' }, { type: 'disjunctive', value: '5' }]);
      _refine('4');
      expect(helper.getRefinements(attributeName)).toEqual([{ type: 'disjunctive', value: '4' }, { type: 'disjunctive', value: '5' }]);
      expect(helper.search.callCount).toBe(2);
    }
  });
});