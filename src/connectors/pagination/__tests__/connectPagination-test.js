'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectPagination = require('../connectPagination.js');

var _connectPagination2 = _interopRequireDefault(_connectPagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectPagination', function () {
  it('connectPagination - Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectPagination2.default)(rendering);
    var widget = makeWidget({
      foo: 'bar' // dummy param for `widgetParams` test
    });

    // does not have a getConfiguration method
    expect(widget.getConfiguration).toBe(undefined);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
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
      var firstRenderingOptions = rendering.lastCall.args[0];
      expect(firstRenderingOptions.currentRefinement).toBe(0);
      expect(firstRenderingOptions.nbHits).toBe(0);
      expect(firstRenderingOptions.nbPages).toBe(0);
      expect(firstRenderingOptions.widgetParams).toEqual({
        foo: 'bar'
      });
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ test: 'oneTime' }],
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

      // should call the rendering with values from the results
      var secondRenderingOptions = rendering.lastCall.args[0];
      expect(secondRenderingOptions.currentRefinement).toBe(0);
      expect(secondRenderingOptions.nbHits).toBe(1);
      expect(secondRenderingOptions.nbPages).toBe(1);
    }
  });

  it('Provides a function to update the refinements at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectPagination2.default)(rendering);

    var widget = makeWidget();

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
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
      var refine = renderOptions.refine;

      refine(2);
      expect(helper.getPage()).toBe(2);
      expect(helper.search.callCount).toBe(1);
    }

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine;

      _refine(7);
      expect(helper.getPage()).toBe(7);
      expect(helper.search.callCount).toBe(2);
    }
  });

  it('Provides the pages to render (default)', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectPagination2.default)(rendering);

    var widget = makeWidget();

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
    helper.search = jest.fn();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    // page 0
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var renderOptions = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var pages = renderOptions.pages;

      expect(pages).toEqual([0, 1, 2, 3, 4, 5, 6]);
    }

    // some random page
    helper.setPage(5);
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var _renderOptions2 = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var _pages = _renderOptions2.pages;

      expect(_pages).toEqual([2, 3, 4, 5, 6, 7, 8]);
    }

    // last pages
    helper.setPage(49);
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var _renderOptions3 = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var _pages2 = _renderOptions3.pages;

      expect(_pages2).toEqual([43, 44, 45, 46, 47, 48, 49]);
    }
  });

  it('Provides the pages to render (extra padding)', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectPagination2.default)(rendering);

    var widget = makeWidget({
      padding: 5
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
    helper.search = jest.fn();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    // page 0
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var renderOptions = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var pages = renderOptions.pages;

      expect(pages).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }

    // some random page
    helper.setPage(5);
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var _renderOptions4 = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var _pages3 = _renderOptions4.pages;

      expect(_pages3).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }

    // last pages
    helper.setPage(49);
    widget.render({
      results: new SearchResults(helper.state, [{ nbPages: 50 }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      var _renderOptions5 = rendering.mock.calls[rendering.mock.calls.length - 1][0];
      var _pages4 = _renderOptions5.pages;

      expect(_pages4).toEqual([39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    }
  });
});