'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectRange = require('../connectRange.js');

var _connectRange2 = _interopRequireDefault(_connectRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectRange', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectRange2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({
      attributeName: attributeName
    });

    var config = widget.getConfiguration();
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
          range = _rendering$lastCall$a.range,
          start = _rendering$lastCall$a.start,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(range).toEqual({ min: 0, max: 0 });
      expect(start).toEqual([-Infinity, Infinity]);
      expect(widgetParams).toEqual({
        attributeName: attributeName,
        precision: 2
      });
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ test: 'oneTime' }],
        facets: { price: { 10: 1, 20: 1, 30: 1 } },
        // eslint-disable-next-line camelcase
        facets_stats: {
          price: {
            avg: 20,
            max: 30,
            min: 10,
            sum: 60
          }
        },
        nbHits: 1,
        nbPages: 1,
        page: 0
      }]),
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

      // should provide good values for the first rendering
      var _rendering$lastCall$a2 = rendering.lastCall.args[0],
          _range = _rendering$lastCall$a2.range,
          _start = _rendering$lastCall$a2.start,
          _widgetParams = _rendering$lastCall$a2.widgetParams;

      expect(_range).toEqual({ min: 10, max: 30 });
      expect(_start).toEqual([-Infinity, Infinity]);
      expect(_widgetParams).toEqual({
        attributeName: attributeName,
        precision: 2
      });
    }
  });

  it('Accepts some user bounds', function () {
    var makeWidget = (0, _connectRange2.default)(function () {});

    var attributeName = 'price';

    expect(makeWidget({ attributeName: attributeName, min: 0 }).getConfiguration()).toEqual({
      disjunctiveFacets: [attributeName],
      numericRefinements: _defineProperty({}, attributeName, { '>=': [0] })
    });

    expect(makeWidget({ attributeName: attributeName, max: 100 }).getConfiguration()).toEqual({
      disjunctiveFacets: [attributeName],
      numericRefinements: _defineProperty({}, attributeName, { '<=': [100] })
    });

    expect(makeWidget({ attributeName: attributeName, min: 0, max: 100 }).getConfiguration()).toEqual({
      disjunctiveFacets: [attributeName],
      numericRefinements: _defineProperty({}, attributeName, {
        '>=': [0],
        '<=': [100]
      })
    });
  });

  it('Provides a function to update the refinements at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectRange2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({
      attributeName: attributeName
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration());
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
      expect(helper.getNumericRefinement('price', '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement('price', '<=')).toEqual(undefined);
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine;

      refine([10, 30]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      expect(helper.search.callCount).toBe(1);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ test: 'oneTime' }],
        facets: { price: { 10: 1, 20: 1, 30: 1 } },
        // eslint-disable-next-line camelcase
        facets_stats: {
          price: {
            avg: 20,
            max: 30,
            min: 10,
            sum: 60
          }
        },
        nbHits: 1,
        nbPages: 1,
        page: 0
      }, {}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine;

      _refine([23, 27]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([23]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([27]);
      expect(helper.search.callCount).toBe(2);
    }
  });

  it('should add numeric refinement when refining min boundary without previous configuration', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectRange2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({ attributeName: attributeName, min: 0, max: 500 });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration());
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
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([500]);

      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine;

      refine([10, 30]);

      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      expect(helper.search.callCount).toBe(1);

      refine([0, undefined]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([500]);
    }
  });

  it('should add numeric refinement when refining min boundary with previous configuration', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectRange2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({ attributeName: attributeName, min: 0, max: 500 });
    var configuration = widget.getConfiguration({
      indexName: 'movie'
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', configuration);
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
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([500]);

      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine;

      refine([10, 30]);

      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      expect(helper.search.callCount).toBe(1);

      refine([0, undefined]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([500]);
    }
  });

  it('should refine on boundaries when no min/max defined', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectRange2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({ attributeName: attributeName });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration());
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
      expect(helper.getNumericRefinement('price', '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement('price', '<=')).toEqual(undefined);

      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine;


      refine([undefined, 100]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([100]);
      expect(helper.search.callCount).toBe(1);

      refine([0, undefined]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual(undefined);
      expect(helper.search.callCount).toBe(2);

      refine([0, 100]);
      expect(helper.getNumericRefinement('price', '>=')).toEqual([0]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([100]);
      expect(helper.search.callCount).toBe(3);
    }
  });

  describe('getConfiguration', function () {
    var attributeName = 'price';
    var rendering = function rendering() {};

    it('expect to return default configuration', function () {
      var currentConfiguration = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName
      });

      var expectation = { disjunctiveFacets: ['price'] };
      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });

    it('expect to return default configuration if previous one has already numeric refinements', function () {
      var currentConfiguration = {
        numericRefinements: {
          price: {
            '<=': [500]
          }
        }
      };

      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        max: 500
      });

      var expectation = { disjunctiveFacets: ['price'] };
      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });

    it('expect to return default configuration if the given min bound are greater than max bound', function () {
      var currentConfiguration = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 1000,
        max: 500
      });

      var expectation = { disjunctiveFacets: ['price'] };
      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });

    it('expect to return configuration with min numeric refinement', function () {
      var currentConfiguration = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 10
      });

      var expectation = {
        disjunctiveFacets: ['price'],
        numericRefinements: {
          price: {
            '>=': [10]
          }
        }
      };

      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });

    it('expect to return configuration with max numeric refinement', function () {
      var currentConfiguration = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        max: 10
      });

      var expectation = {
        disjunctiveFacets: ['price'],
        numericRefinements: {
          price: {
            '<=': [10]
          }
        }
      };

      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });

    it('expect to return configuration with both numeric refinements', function () {
      var currentConfiguration = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 10,
        max: 500
      });

      var expectation = {
        disjunctiveFacets: ['price'],
        numericRefinements: {
          price: {
            '>=': [10],
            '<=': [500]
          }
        }
      };

      var actual = widget.getConfiguration(currentConfiguration);

      expect(actual).toEqual(expectation);
    });
  });

  describe('_getCurrentRange', function () {
    var attributeName = 'price';
    var rendering = function rendering() {};

    it('expect to return default range', function () {
      var stats = {};
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName
      });

      var expectation = { min: 0, max: 0 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return range from bounds', function () {
      var stats = { min: 10, max: 500 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 20,
        max: 250
      });

      var expectation = { min: 20, max: 250 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return range from stats', function () {
      var stats = { min: 10, max: 500 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName
      });

      var expectation = { min: 10, max: 500 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return rounded range values when precision is 0', function () {
      var stats = { min: 1.79, max: 499.99 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        precision: 0
      });

      var expectation = { min: 1, max: 500 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return rounded range values when precision is 1', function () {
      var stats = { min: 1.12345, max: 499.56789 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        precision: 1
      });

      var expectation = { min: 1.1, max: 499.6 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return rounded range values when precision is 2', function () {
      var stats = { min: 1.12345, max: 499.56789 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        precision: 2
      });

      var expectation = { min: 1.12, max: 499.57 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });

    it('expect to return rounded range values when precision is 3', function () {
      var stats = { min: 1.12345, max: 499.56789 };
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        precision: 3
      });

      var expectation = { min: 1.123, max: 499.568 };
      var actual = widget._getCurrentRange(stats);

      expect(actual).toEqual(expectation);
    });
  });

  describe('_getCurrentRefinement', function () {
    var attributeName = 'price';
    var rendering = function rendering() {};
    var createHelper = function createHelper() {
      return (0, _algoliasearchHelper2.default)(fakeClient);
    };

    it('expect to return default refinement', function () {
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });
      var helper = createHelper();

      var expectation = [-Infinity, Infinity];
      var actual = widget._getCurrentRefinement(helper);

      expect(actual).toEqual(expectation);
    });

    it('expect to return refinement from helper', function () {
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });
      var helper = createHelper();

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 100);

      var expectation = [10, 100];
      var actual = widget._getCurrentRefinement(helper);

      expect(actual).toEqual(expectation);
    });

    it('expect to return float refinement values', function () {
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });
      var helper = createHelper();

      helper.addNumericRefinement(attributeName, '>=', 10.9);
      helper.addNumericRefinement(attributeName, '<=', 99.1);

      var expectation = [10.9, 99.1];
      var actual = widget._getCurrentRefinement(helper);

      expect(actual).toEqual(expectation);
    });
  });

  describe('_refine', function () {
    var attributeName = 'price';
    var rendering = function rendering() {};
    var createHelper = function createHelper() {
      var helper = (0, _algoliasearchHelper2.default)(fakeClient);
      helper.search = jest.fn();
      var initialClearRefinements = helper.clearRefinements;
      helper.clearRefinements = jest.fn(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return initialClearRefinements.apply(helper, args);
      });

      return helper;
    };

    it('expect to refine when range are not set', function () {
      var range = {};
      var values = [10, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName
      });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to refine when values are in range', function () {
      var range = { min: 0, max: 500 };
      var values = [10, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to refine when values are parsable integer', function () {
      var range = { min: 0, max: 500 };
      var values = ['10', '490'];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to refine when values are parsable float', function () {
      var range = { min: 0, max: 500 };
      var values = ['10.50', '490.50'];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10.5]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490.5]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to refine min when user bounds are set and value is at range bound', function () {
      var range = { min: 10, max: 500 };
      var values = [10, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 10
      });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to refine max when user bounds are set and value is at range bound', function () {
      var range = { min: 0, max: 490 };
      var values = [10, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        max: 490
      });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset min refinement when value is undefined', function () {
      var range = { min: 0, max: 500 };
      var values = [undefined, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset max refinement when value is undefined', function () {
      var range = { min: 0, max: 500 };
      var values = [10, undefined];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset min refinement when value is empty string', function () {
      var range = { min: 0, max: 500 };
      var values = ['', 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset max refinement when value is empty string', function () {
      var range = { min: 0, max: 500 };
      var values = [10, ''];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset min refinement when user bounds are not set and value is at bounds', function () {
      var range = { min: 0, max: 500 };
      var values = [0, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset max refinement when user bounds are not set and value is at bounds', function () {
      var range = { min: 0, max: 500 };
      var values = [10, 500];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).toHaveBeenCalledWith(attributeName);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset min refinement when user bounds are set and value is nullable', function () {
      var range = { min: 0, max: 500 };
      var values = [undefined, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        min: 10
      });

      helper.addNumericRefinement(attributeName, '>=', 20);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to reset max refinement when user bounds are set and value is nullable', function () {
      var range = { min: 0, max: 500 };
      var values = [10, undefined];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({
        attributeName: attributeName,
        max: 250
      });

      helper.addNumericRefinement(attributeName, '>=', 240);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([250]);
      expect(helper.clearRefinements).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it("expect to not refine when min it's out of range", function () {
      var range = { min: 10, max: 500 };
      var values = [0, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).not.toHaveBeenCalled();
      expect(helper.search).not.toHaveBeenCalled();
    });

    it("expect to not refine when max it's out of range", function () {
      var range = { min: 0, max: 490 };
      var values = [10, 500];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).not.toHaveBeenCalled();
      expect(helper.search).not.toHaveBeenCalled();
    });

    it("expect to not refine when values don't have changed from empty state", function () {
      var range = { min: 0, max: 500 };
      var values = [undefined, undefined];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).not.toHaveBeenCalled();
      expect(helper.search).not.toHaveBeenCalled();
    });

    it("expect to not refine when values don't have changed from non empty state", function () {
      var range = { min: 0, max: 500 };
      var values = [10, 490];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      helper.addNumericRefinement(attributeName, '>=', 10);
      helper.addNumericRefinement(attributeName, '<=', 490);

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual([10]);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual([490]);
      expect(helper.clearRefinements).not.toHaveBeenCalled();
      expect(helper.search).not.toHaveBeenCalled();
    });

    it('expect to not refine when values are invalid', function () {
      var range = { min: 0, max: 500 };
      var values = ['ADASA', 'FFDSFQS'];
      var helper = createHelper();
      var widget = (0, _connectRange2.default)(rendering)({ attributeName: attributeName });

      widget._refine(helper, range)(values);

      expect(helper.getNumericRefinement(attributeName, '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement(attributeName, '<=')).toEqual(undefined);
      expect(helper.clearRefinements).not.toHaveBeenCalled();
      expect(helper.search).not.toHaveBeenCalled();
    });
  });
});