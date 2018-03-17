'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectHitsPerPage = require('../connectHitsPerPage.js');

var _connectHitsPerPage2 = _interopRequireDefault(_connectHitsPerPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectHitsPerPage', function () {
  it('should throw when there is two default items defined', function () {
    expect(function () {
      (0, _connectHitsPerPage2.default)(function () {})({
        items: [{ value: 3, label: '3 items per page', default: true }, { value: 10, label: '10 items per page', default: true }]
      });
    }).toThrow(/^\[Error\]/);
  });

  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }]
    });

    expect(_typeof(widget.getConfiguration)).toEqual('function');
    expect(widget.getConfiguration()).toEqual({});

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {
      hitsPerPage: 3
    });
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
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }]
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
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }]
    });
  });

  it('Configures the search with the default hitsPerPage provided', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page', default: true }]
    });

    expect(widget.getConfiguration()).toEqual({
      hitsPerPage: 10
    });
  });

  it('Does not configures the search when there is no default value', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }]
    });

    expect(widget.getConfiguration()).toEqual({});
  });

  it('Provide a function to change the current hits per page, and provide the current value', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }, { value: 11, label: '' }]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {
      hitsPerPage: 11
    });
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
    var refine = firstRenderingOptions.refine;

    expect(helper.getQueryParameter('hitsPerPage')).toBe(11);
    refine(3);
    expect(helper.getQueryParameter('hitsPerPage')).toBe(3);

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    var renderSetValue = secondRenderingOptions.refine;

    expect(helper.getQueryParameter('hitsPerPage')).toBe(3);
    renderSetValue(10);
    expect(helper.getQueryParameter('hitsPerPage')).toBe(10);

    expect(helper.search.callCount).toBe(2);
  });

  it('provides the current hitsPerPage value', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }, { value: 7, label: '' }]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {
      hitsPerPage: 7
    });
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
    expect(firstRenderingOptions.items).toMatchSnapshot();
    firstRenderingOptions.refine(3);

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.items).toMatchSnapshot();
  });

  it('adds an option for the unselecting values, when the current hitsPerPage is defined elsewhere', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectHitsPerPage2.default)(rendering);
    var widget = makeWidget({
      items: [{ value: 3, label: '3 items per page' }, { value: 10, label: '10 items per page' }]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {
      hitsPerPage: 7
    });
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
    expect(firstRenderingOptions.items).toHaveLength(3);
    firstRenderingOptions.refine(firstRenderingOptions.items[0].value);
    expect(helper.getQueryParameter('hitsPerPage')).toBe(undefined);

    // Reset the hitsPerPage to an actual value
    helper.setQueryParameter('hitsPerPage', 7);

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.items).toHaveLength(3);
    secondRenderingOptions.refine(secondRenderingOptions.items[0].value);
    expect(helper.getQueryParameter('hitsPerPage')).toBe(undefined);
  });
});