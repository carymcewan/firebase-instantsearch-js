'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectHierarchicalMenu = require('../connectHierarchicalMenu.js');

var _connectHierarchicalMenu2 = _interopRequireDefault(_connectHierarchicalMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

describe('connectHierarchicalMenu', function () {
  it('It should compute getConfiguration() correctly', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectHierarchicalMenu2.default)(rendering);

    var widget = makeWidget({ attributes: ['category', 'sub_category'] });

    // when there is no hierarchicalFacets into current configuration
    {
      var config = widget.getConfiguration({});
      expect(config).toEqual({
        hierarchicalFacets: [{
          attributes: ['category', 'sub_category'],
          name: 'category',
          rootPath: null,
          separator: ' > ',
          showParentLevel: true
        }],
        maxValuesPerFacet: 10
      });
    }

    // when there is an identical hierarchicalFacets into current configuration
    {
      var spy = jest.spyOn(global.console, 'warn');
      var _config = widget.getConfiguration({
        hierarchicalFacets: [{ name: 'category' }]
      });
      expect(_config).toEqual({});
      expect(spy).toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
    }

    // when there is already a different hierarchicalFacets into current configuration
    {
      var _config2 = widget.getConfiguration({
        hierarchicalFacets: [{ name: 'foo' }]
      });
      expect(_config2).toEqual({
        hierarchicalFacets: [{
          attributes: ['category', 'sub_category'],
          name: 'category',
          rootPath: null,
          separator: ' > ',
          showParentLevel: true
        }],
        maxValuesPerFacet: 10
      });
    }
  });

  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHierarchicalMenu2.default)(rendering);
    var widget = makeWidget({
      attributes: ['category', 'sub_category']
    });

    var config = widget.getConfiguration({});
    expect(config).toEqual({
      hierarchicalFacets: [{
        attributes: ['category', 'sub_category'],
        name: 'category',
        rootPath: null,
        separator: ' > ',
        showParentLevel: true
      }],
      maxValuesPerFacet: 10
    });

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', config);
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
      attributes: ['category', 'sub_category']
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
      attributes: ['category', 'sub_category']
    });
  });

  it('Provide a function to clear the refinements at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHierarchicalMenu2.default)(rendering);
    var widget = makeWidget({
      attributes: ['category', 'sub_category']
    });

    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', widget.getConfiguration({}));
    helper.search = _sinon2.default.stub();

    helper.toggleRefinement('category', 'value');

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    var refine = firstRenderingOptions.refine;

    refine('value');
    expect(helper.hasRefinements('category')).toBe(false);
    refine('value');
    expect(helper.hasRefinements('category')).toBe(true);

    widget.render({
      results: new SearchResults(helper.state, [{}, {}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    var renderToggleRefinement = secondRenderingOptions.refine;

    renderToggleRefinement('value');
    expect(helper.hasRefinements('category')).toBe(false);
    renderToggleRefinement('value');
    expect(helper.hasRefinements('category')).toBe(true);
  });

  it('provides the correct facet values', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHierarchicalMenu2.default)(rendering);
    var widget = makeWidget({
      attributes: ['category', 'subCategory']
    });

    var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', widget.getConfiguration({}));
    helper.search = _sinon2.default.stub();

    helper.toggleRefinement('category', 'Decoration');

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    // During the first rendering there are no facet values
    // The function get an empty array so that it doesn't break
    // over null-ish values.
    expect(firstRenderingOptions.items).toEqual([]);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            Decoration: 880
          },
          subCategory: {
            'Decoration > Candle holders & candles': 193,
            'Decoration > Frames & pictures': 173
          }
        }
      }, {
        facets: {
          category: {
            Decoration: 880,
            Outdoor: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.items).toEqual([{
      label: 'Decoration',
      value: 'Decoration',
      count: 880,
      isRefined: true,
      data: [{
        label: 'Candle holders & candles',
        value: 'Decoration > Candle holders & candles',
        count: 193,
        isRefined: false,
        data: null
      }, {
        label: 'Frames & pictures',
        value: 'Decoration > Frames & pictures',
        count: 173,
        isRefined: false,
        data: null
      }]
    }, {
      label: 'Outdoor',
      value: 'Outdoor',
      count: 47,
      isRefined: false,
      data: null
    }]);
  });
});