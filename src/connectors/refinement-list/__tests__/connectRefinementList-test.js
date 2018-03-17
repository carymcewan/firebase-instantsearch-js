'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _escapeHighlight = require('../../../lib/escape-highlight.js');

var _connectRefinementList = require('../connectRefinementList.js');

var _connectRefinementList2 = _interopRequireDefault(_connectRefinementList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;


var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectRefinementList', function () {
  var rendering = void 0;
  var makeWidget = void 0;
  beforeEach(function () {
    rendering = jest.fn();
    makeWidget = (0, _connectRefinementList2.default)(rendering);
  });

  it('throws on bad usage', function () {
    expect(_connectRefinementList2.default).toThrow();

    expect(function () {
      return (0, _connectRefinementList2.default)({
        operator: 'and'
      });
    }).toThrow();

    expect(function () {
      return (0, _connectRefinementList2.default)(function () {})();
    }).toThrow();

    expect(function () {
      return (0, _connectRefinementList2.default)(function () {})({
        operator: 'and'
      });
    }).toThrow();

    expect(function () {
      return (0, _connectRefinementList2.default)(function () {})({
        attributeName: 'company',
        operator: 'YUP'
      });
    }).toThrow();
  });

  describe('options configuring the helper', function () {
    it('`attributeName`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet'
      });

      expect(widget.getConfiguration()).toEqual({
        disjunctiveFacets: ['myFacet'],
        maxValuesPerFacet: 10
      });
    });

    it('`limit`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet',
        limit: 20
      });

      expect(widget.getConfiguration()).toEqual({
        disjunctiveFacets: ['myFacet'],
        maxValuesPerFacet: 20
      });

      expect(widget.getConfiguration({ maxValuesPerFacet: 100 })).toEqual({
        disjunctiveFacets: ['myFacet'],
        maxValuesPerFacet: 100
      }, 'Can read the previous maxValuesPerFacet value');
    });

    it('`operator="and"`', function () {
      var widget = makeWidget({
        attributeName: 'myFacet',
        operator: 'and'
      });

      expect(widget.getConfiguration()).toEqual({
        facets: ['myFacet'],
        maxValuesPerFacet: 10
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
      disjunctiveFacets: ['myFacet'],
      maxValuesPerFacet: 9
    });

    // test if widget is not rendered yet at this point
    expect(rendering).not.toHaveBeenCalled();

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

    // test that rendering has been called during init with isFirstRendering = true
    expect(rendering).toHaveBeenCalledTimes(1);
    // test if isFirstRendering is true during init
    expect(rendering).lastCalledWith(expect.any(Object), true);

    var firstRenderingOptions = rendering.mock.calls[0][0];
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
    expect(rendering).toHaveBeenCalledTimes(2);
    expect(rendering).lastCalledWith(expect.any(Object), false);

    var secondRenderingOptions = rendering.mock.calls[1][0];
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
    helper.search = jest.fn();

    helper.toggleRefinement('category', 'value');

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.mock.calls[0][0];
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

    var secondRenderingOptions = rendering.mock.calls[1][0];
    var renderToggleRefinement = secondRenderingOptions.refine;

    renderToggleRefinement('value');
    expect(helper.hasRefinements('category')).toBe(false);
    renderToggleRefinement('value');
    expect(helper.hasRefinements('category')).toBe(true);
  });

  it('If there are too few items then canToggleShowMore is false', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 3,
      showMoreLimit: 10
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

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
            c1: 880,
            c2: 47
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.mock.calls[1][0];
    expect(secondRenderingOptions.canToggleShowMore).toBe(false);
  });

  it('If there are no showMoreLimit specified, canToggleShowMore is false', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 1
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

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
            c1: 880,
            c2: 47
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering).lastCalledWith(expect.objectContaining({
      canToggleShowMore: false
    }), false);
  });

  it('If there are same amount of items then canToggleShowMore is false', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2,
      showMoreLimit: 10
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

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
            c1: 880,
            c2: 47
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering).lastCalledWith(expect.objectContaining({
      canToggleShowMore: false
    }), false);
  });

  it('If there are enough items then canToggleShowMore is true', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 1,
      showMoreLimit: 10
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

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
            c1: 880,
            c2: 47
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.mock.calls[1][0];
    expect(secondRenderingOptions.canToggleShowMore).toBe(true);

    // toggleShowMore will set the state of the show more to true
    // therefore it's always possible to go back and show less items
    secondRenderingOptions.toggleShowMore();

    var thirdRenderingOptions = rendering.mock.calls[2][0];
    expect(thirdRenderingOptions.canToggleShowMore).toBe(true);
  });

  it('Show more should toggle between two limits', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 1,
      showMoreLimit: 3
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

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
            c1: 880,
            c2: 47,
            c3: 880,
            c4: 47
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 47,
            c3: 880,
            c4: 47
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering).lastCalledWith(expect.objectContaining({
      canToggleShowMore: true,
      items: [{
        label: 'c1',
        value: 'c1',
        highlighted: 'c1',
        count: 880,
        isRefined: false
      }]
    }), false);

    var secondRenderingOptions = rendering.mock.calls[1][0];
    // toggleShowMore does a new render
    secondRenderingOptions.toggleShowMore();

    var thirdRenderingOptions = rendering.mock.calls[2][0];
    expect(thirdRenderingOptions.items).toEqual([{
      label: 'c1',
      value: 'c1',
      highlighted: 'c1',
      count: 880,
      isRefined: false
    }, {
      label: 'c3',
      value: 'c3',
      highlighted: 'c3',
      count: 880,
      isRefined: false
    }, {
      label: 'c2',
      value: 'c2',
      highlighted: 'c2',
      count: 47,
      isRefined: false
    }]);
  });

  it('hasExhaustiveItems indicates if the items provided are exhaustive - without other widgets making the maxValuesPerFacet bigger', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    expect(rendering.mock.calls[0][0].hasExhaustiveItems).toEqual(true);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880,
            c2: 880
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 880
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    // this one is `false` because we're not sure that what we asked is the actual number of facet values
    expect(rendering.mock.calls[1][0].hasExhaustiveItems).toEqual(false);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880,
            c2: 34,
            c3: 440
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 34,
            c3: 440
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering.mock.calls[2][0].hasExhaustiveItems).toEqual(false);
  });

  it('hasExhaustiveItems indicates if the items provided are exhaustive - with an other widgets making the maxValuesPerFacet bigger', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', _extends({}, widget.getConfiguration({}), {
      maxValuesPerFacet: 3
    }));
    helper.search = jest.fn();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    expect(rendering.mock.calls[0][0].hasExhaustiveItems).toEqual(true);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880,
            c2: 880
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 880
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering.mock.calls[1][0].hasExhaustiveItems).toEqual(true);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880,
            c2: 34,
            c3: 440,
            c4: 440
          }
        }
      }, {
        facets: {
          category: {
            c1: 880,
            c2: 34,
            c3: 440,
            c4: 440
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    expect(rendering.mock.calls[2][0].hasExhaustiveItems).toEqual(false);
  });

  it('can search in facet values', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration({}));
    helper.search = jest.fn();
    helper.searchForFacetValues = jest.fn().mockReturnValue(Promise.resolve({
      exhaustiveFacetsCount: true,
      facetHits: [{
        count: 33,
        highlighted: 'Salvador <em>Da</em>li',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: '<em>Da</em>vidoff',
        value: 'Davidoff'
      }],
      processingTimeMS: 1
    }));

    // Simulate the lifecycle
    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });
    expect(rendering).toHaveBeenCalledTimes(1);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880
          }
        }
      }, {
        facets: {
          category: {
            c1: 880
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });
    expect(rendering).toHaveBeenCalledTimes(2);
    // Simulation end

    var search = rendering.mock.calls[1][0].searchForItems;
    search('da');

    var _helper$searchForFace = _slicedToArray(helper.searchForFacetValues.mock.calls[0], 4),
        sffvFacet = _helper$searchForFace[0],
        sffvQuery = _helper$searchForFace[1],
        maxNbItems = _helper$searchForFace[2],
        paramOverride = _helper$searchForFace[3];

    expect(sffvQuery).toBe('da');
    expect(sffvFacet).toBe('category');
    expect(maxNbItems).toBe(2);
    expect(paramOverride).toEqual({
      highlightPreTag: undefined,
      highlightPostTag: undefined
    });

    return Promise.resolve().then(function () {
      expect(rendering).toHaveBeenCalledTimes(3);
      expect(rendering.mock.calls[2][0].items).toEqual([{
        count: 33,
        highlighted: 'Salvador <em>Da</em>li',
        label: 'Salvador Dali',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: '<em>Da</em>vidoff',
        label: 'Davidoff',
        value: 'Davidoff'
      }]);
    });
  });

  it('can search in facet values, and reset pre post tags if needed', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', _extends({}, widget.getConfiguration({}), _escapeHighlight.tagConfig));
    helper.search = jest.fn();
    helper.searchForFacetValues = jest.fn().mockReturnValue(Promise.resolve({
      exhaustiveFacetsCount: true,
      facetHits: [{
        count: 33,
        highlighted: 'Salvador <em>Da</em>li',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: '<em>Da</em>vidoff',
        value: 'Davidoff'
      }],
      processingTimeMS: 1
    }));

    // Simulate the lifecycle
    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });
    expect(rendering).toHaveBeenCalledTimes(1);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880
          }
        }
      }, {
        facets: {
          category: {
            c1: 880
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });
    expect(rendering).toHaveBeenCalledTimes(2);
    // Simulation end

    var search = rendering.mock.calls[1][0].searchForItems;
    search('da');

    var _helper$searchForFace2 = _slicedToArray(helper.searchForFacetValues.mock.calls[0], 4),
        sffvFacet = _helper$searchForFace2[0],
        sffvQuery = _helper$searchForFace2[1],
        maxNbItems = _helper$searchForFace2[2],
        paramOverride = _helper$searchForFace2[3];

    expect(sffvQuery).toBe('da');
    expect(sffvFacet).toBe('category');
    expect(maxNbItems).toBe(2);
    expect(paramOverride).toEqual({
      highlightPreTag: undefined,
      highlightPostTag: undefined
    });

    return Promise.resolve().then(function () {
      expect(rendering).toHaveBeenCalledTimes(3);
      expect(rendering.mock.calls[2][0].items).toEqual([{
        count: 33,
        highlighted: 'Salvador <em>Da</em>li',
        label: 'Salvador Dali',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: '<em>Da</em>vidoff',
        label: 'Davidoff',
        value: 'Davidoff'
      }]);
    });
  });

  it('can search in facet values, and set post and pre tags if escapeFacetValues is true', function () {
    var widget = makeWidget({
      attributeName: 'category',
      limit: 2,
      escapeFacetValues: true
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', _extends({}, widget.getConfiguration({}), _escapeHighlight.tagConfig));
    helper.search = jest.fn();
    helper.searchForFacetValues = jest.fn().mockReturnValue(Promise.resolve({
      exhaustiveFacetsCount: true,
      facetHits: [{
        count: 33,
        highlighted: 'Salvador ' + _escapeHighlight.tagConfig.highlightPreTag + 'Da' + _escapeHighlight.tagConfig.highlightPostTag + 'li',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: _escapeHighlight.tagConfig.highlightPreTag + 'Da' + _escapeHighlight.tagConfig.highlightPostTag + 'vidoff',
        value: 'Davidoff'
      }],
      processingTimeMS: 1
    }));

    // Simulate the lifecycle
    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });
    expect(rendering).toHaveBeenCalledTimes(1);

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [],
        facets: {
          category: {
            c1: 880
          }
        }
      }, {
        facets: {
          category: {
            c1: 880
          }
        }
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });
    expect(rendering).toHaveBeenCalledTimes(2);
    // Simulation end

    var search = rendering.mock.calls[1][0].searchForItems;
    search('da');

    var _helper$searchForFace3 = _slicedToArray(helper.searchForFacetValues.mock.calls[0], 4),
        sffvFacet = _helper$searchForFace3[0],
        sffvQuery = _helper$searchForFace3[1],
        maxNbItems = _helper$searchForFace3[2],
        paramOverride = _helper$searchForFace3[3];

    expect(sffvQuery).toBe('da');
    expect(sffvFacet).toBe('category');
    expect(maxNbItems).toBe(2);
    expect(paramOverride).toEqual(_escapeHighlight.tagConfig);

    return Promise.resolve().then(function () {
      expect(rendering).toHaveBeenCalledTimes(3);
      expect(rendering.mock.calls[2][0].items).toEqual([{
        count: 33,
        highlighted: 'Salvador <em>Da</em>li',
        label: 'Salvador Dali',
        value: 'Salvador Dali'
      }, {
        count: 9,
        highlighted: '<em>Da</em>vidoff',
        label: 'Davidoff',
        value: 'Davidoff'
      }]);
    });
  });
});