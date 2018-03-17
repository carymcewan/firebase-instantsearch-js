'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectMenu = require('../connectMenu.js');

var _connectMenu2 = _interopRequireDefault(_connectMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectMenu', function () {
  var rendering = void 0;
  var makeWidget = void 0;
  beforeEach(function () {
    rendering = _sinon2.default.stub();
    makeWidget = (0, _connectMenu2.default)(rendering);
  });

  it('throws on bad usage', function () {
    expect(_connectMenu2.default).toThrow();

    expect(function () {
      return (0, _connectMenu2.default)({});
    }).toThrow();

    expect(function () {
      return (0, _connectMenu2.default)(function () {})();
    }).toThrow();

    expect(function () {
      return (0, _connectMenu2.default)({ limit: 10 });
    }).toThrow();

    expect(function () {
      return (0, _connectMenu2.default)(function () {})({ limit: 10 });
    }).toThrow();
  });

  describe('options configuring the helper', function () {
    it('`attributeName`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet'
      });

      expect(widget.getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'myFacet',
          attributes: ['myFacet']
        }],
        maxValuesPerFacet: 10
      });
    });

    it('`limit`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet',
        limit: 20
      });

      expect(widget.getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'myFacet',
          attributes: ['myFacet']
        }],
        maxValuesPerFacet: 20
      });
    });
  });

  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var widget = makeWidget({
      attributeName: 'myFacet',
      limit: 9
    });

    var config = widget.getConfiguration({});
    expect(config).toEqual({
      hierarchicalFacets: [{
        name: 'myFacet',
        attributes: ['myFacet']
      }],
      maxValuesPerFacet: 9
    });

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

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

    // test that rendering has been called during init with isFirstRendering = true
    expect(rendering.callCount).toBe(1);
    // test if isFirstRendering is true during init
    expect(rendering.lastCall.args[1]).toBe(true);

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.canRefine).toBe(false);
    expect(firstRenderingOptions.widgetParams).toEqual({
      attributeName: 'myFacet',
      limit: 9
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

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.canRefine).toBe(false);
    expect(secondRenderingOptions.widgetParams).toEqual({
      attributeName: 'myFacet',
      limit: 9
    });
  });

  it('Provide a function to clear the refinements at each step', function () {
    var widget = makeWidget({
      attributeName: 'category'
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
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
    var renderRefine = secondRenderingOptions.refine;

    renderRefine('value');
    expect(helper.hasRefinements('category')).toBe(false);
    renderRefine('value');
    expect(helper.hasRefinements('category')).toBe(true);
  });

  it('provides the correct facet values', function () {
    var widget = makeWidget({
      attributeName: 'category'
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
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
      data: null
    }, {
      label: 'Outdoor',
      value: 'Outdoor',
      count: 47,
      isRefined: false,
      data: null
    }]);
  });

  describe('showMore', function () {
    it('should throw when `showMoreLimit` is lower than `limit`', function () {
      expect(function () {
        return (0, _connectMenu2.default)(function () {})({
          attributeName: 'myFacet',
          limit: 10,
          showMoreLimit: 1
        });
      }).toThrow();
    });

    it('should provide `showMoreLimit` as `maxValuesPerFacet`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet',
        limit: 10,
        showMoreLimit: 20
      });

      expect(widget.getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'myFacet',
          attributes: ['myFacet']
        }],
        maxValuesPerFacet: 20
      });
    });

    it('should initialize with `isShowingMore === false`', function () {
      // Given
      var widget = makeWidget({
        attributeName: 'myFacet',
        limit: 10,
        showMoreLimit: 20
      });

      // When
      var config = widget.getConfiguration({});
      var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);
      helper.search = jest.fn();

      widget.init({
        helper: helper,
        state: helper.state,
        createURL: function createURL() {
          return '#';
        },
        onHistoryChange: function onHistoryChange() {}
      });

      // Then
      var firstRenderingOptions = rendering.lastCall.args[0];
      expect(firstRenderingOptions.isShowingMore).toBe(false);
    });

    it('should toggle `isShowingMore` when `toggleShowMore` is called', function () {
      // Given
      var widget = makeWidget({
        attributeName: 'category',
        limit: 1,
        showMoreLimit: 2
      });

      // When
      var config = widget.getConfiguration({});
      var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);

      helper.search = jest.fn();
      helper.toggleRefinement('category', 'Decoration');

      widget.init({
        helper: helper,
        state: helper.state,
        createURL: function createURL() {
          return '#';
        },
        onHistoryChange: function onHistoryChange() {}
      });

      widget.render({
        results: new SearchResults(helper.state, [{
          hits: [],
          facets: {
            category: {
              Decoration: 880
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

      // Then
      var firstRenderingOptions = rendering.lastCall.args[0];
      expect(firstRenderingOptions.isShowingMore).toBe(false);
      expect(firstRenderingOptions.items).toHaveLength(1);
      expect(firstRenderingOptions.canToggleShowMore).toBe(true);

      // When
      firstRenderingOptions.toggleShowMore();

      // Then
      var secondRenderingOptions = rendering.lastCall.args[0];
      expect(secondRenderingOptions.isShowingMore).toBe(true);
      expect(secondRenderingOptions.items).toHaveLength(2);
      expect(firstRenderingOptions.canToggleShowMore).toBe(true);
    });

    it('should set canToggleShowMore to false when there are not enough items', function () {
      // Given
      var widget = makeWidget({
        attributeName: 'category',
        limit: 1,
        showMoreLimit: 2
      });

      // When
      var config = widget.getConfiguration({});
      var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);

      helper.search = jest.fn();
      helper.toggleRefinement('category', 'Decoration');

      widget.init({
        helper: helper,
        state: helper.state,
        createURL: function createURL() {
          return '#';
        },
        onHistoryChange: function onHistoryChange() {}
      });

      widget.render({
        results: new SearchResults(helper.state, [{
          hits: [],
          facets: {
            category: {
              Decoration: 880
            }
          }
        }, {
          facets: {
            category: {
              Decoration: 880
            }
          }
        }]),
        state: helper.state,
        helper: helper,
        createURL: function createURL() {
          return '#';
        }
      });

      var firstRenderingOptions = rendering.lastCall.args[0];
      expect(firstRenderingOptions.items).toHaveLength(1);
      expect(firstRenderingOptions.canToggleShowMore).toBe(false);
    });
  });
});