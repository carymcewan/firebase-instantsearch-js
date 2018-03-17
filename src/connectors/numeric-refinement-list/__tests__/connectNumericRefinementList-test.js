'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectNumericRefinementList = require('../connectNumericRefinementList.js');

var _connectNumericRefinementList2 = _interopRequireDefault(_connectNumericRefinementList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

var encodeValue = function encodeValue(start, end) {
  return window.encodeURI(JSON.stringify({ start: start, end: end }));
};
var mapOptionsToItems = function mapOptionsToItems(_ref) {
  var start = _ref.start,
      end = _ref.end,
      label = _ref.name;
  return {
    label: label,
    value: encodeValue(start, end),
    isRefined: false
  };
};

describe('connectNumericRefinementList', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var widget = makeWidget({
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }]
    });

    expect(widget.getConfiguration).toBe(undefined);

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

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

    // test that rendering has been called during init with isFirstRendering = true
    expect(rendering.callCount).toBe(1);
    // test if isFirstRendering is true during init
    expect(rendering.lastCall.args[1]).toBe(true);
    expect(rendering.lastCall.args[0].widgetParams).toEqual({
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }]
    });

    widget.render({
      results: new SearchResults(helper.state, [{ nbHits: 0 }]),
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
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }]
    });
  });

  it('Provide a function to update the refinements at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var widget = makeWidget({
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }, { name: '42', start: 42, end: 42 }, { name: 'void' }]
    });

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

    var firstRenderingOptions = rendering.lastCall.args[0];
    var refine = firstRenderingOptions.refine,
        items = firstRenderingOptions.items;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
    refine(items[0].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '<=': [10]
    });
    refine(items[1].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '>=': [10],
      '<=': [20]
    });
    refine(items[2].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '>=': [20]
    });
    refine(items[3].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [42]
    });
    refine(items[4].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({});

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    var renderToggleRefinement = secondRenderingOptions.refine,
        renderFacetValues = secondRenderingOptions.items;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
    renderToggleRefinement(renderFacetValues[0].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '<=': [10]
    });
    renderToggleRefinement(renderFacetValues[1].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '>=': [10],
      '<=': [20]
    });
    renderToggleRefinement(renderFacetValues[2].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '>=': [20]
    });
    renderToggleRefinement(renderFacetValues[3].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [42]
    });
    renderToggleRefinement(renderFacetValues[4].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
  });

  it('provides the correct facet values', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var widget = makeWidget({
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }]
    });

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

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.items).toEqual([{
      label: 'below 10',
      value: encodeValue(undefined, 10),
      isRefined: false
    }, { label: '10 - 20', value: encodeValue(10, 20), isRefined: false }, { label: 'more than 20', value: encodeValue(20), isRefined: false }]);

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.items).toEqual([{
      label: 'below 10',
      value: encodeValue(undefined, 10),
      isRefined: false
    }, { label: '10 - 20', value: encodeValue(10, 20), isRefined: false }, { label: 'more than 20', value: encodeValue(20), isRefined: false }]);
  });

  it('provides isRefined for the currently selected value', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var listOptions = [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }, { name: '42', start: 42, end: 42 }, { name: 'void' }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

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

    var refine = rendering.lastCall.args[0].refine;

    listOptions.forEach(function (option, i) {
      refine(encodeValue(option.start, option.end));

      widget.render({
        results: new SearchResults(helper.state, [{}]),
        state: helper.state,
        helper: helper,
        createURL: function createURL() {
          return '#';
        }
      });

      // The current option should be the one selected
      // First we copy and set the default added values
      var expectedResults = [].concat(listOptions).map(mapOptionsToItems);

      // Then we modify the isRefined value of the one that is supposed to be refined
      expectedResults[i].isRefined = true;

      var renderingParameters = rendering.lastCall.args[0];
      expect(renderingParameters.items).toEqual(expectedResults);

      refine = renderingParameters.refine;
    });
  });

  it('when the state is cleared, the "no value" value should be refined', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var listOptions = [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }, { name: '42', start: 42, end: 42 }, { name: 'void' }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

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

    var refine = rendering.lastCall.args[0].refine;
    // a user selects a value in the refinement list
    refine(encodeValue(listOptions[0].start, listOptions[0].end));

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    // No option should be selected
    var expectedResults0 = [].concat(listOptions).map(mapOptionsToItems);
    expectedResults0[0].isRefined = true;

    var renderingParameters0 = rendering.lastCall.args[0];
    expect(renderingParameters0.items).toEqual(expectedResults0);

    // All the refinements are cleared by a third party
    helper.removeNumericRefinement('numerics');

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    // No option should be selected
    var expectedResults1 = [].concat(listOptions).map(mapOptionsToItems);
    expectedResults1[4].isRefined = true;

    var renderingParameters1 = rendering.lastCall.args[0];
    expect(renderingParameters1.items).toEqual(expectedResults1);
  });

  it('should set `isRefined: true` after calling `refine(item)`', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);
    var listOptions = [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }, { name: '42', start: 42, end: 42 }, { name: 'void' }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
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

    var firstRenderingOptions = rendering.mock.calls[0][0];
    expect(firstRenderingOptions.items[0].isRefined).toBe(false);

    // a user selects a value in the refinement list
    firstRenderingOptions.refine(encodeValue(listOptions[0].start, listOptions[0].end));

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.mock.calls[1][0];
    expect(secondRenderingOptions.items[0].isRefined).toBe(true);
  });

  it('should reset page on refine()', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericRefinementList2.default)(rendering);

    var widget = makeWidget({
      attributeName: 'numerics',
      options: [{ name: 'below 10', end: 10 }, { name: '10 - 20', start: 10, end: 20 }, { name: 'more than 20', start: 20 }, { name: '42', start: 42, end: 42 }, { name: 'void' }]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
    helper.search = _sinon2.default.stub();
    helper.setPage(2);

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    expect(helper.state.page).toBe(2);

    var firstRenderingOptions = rendering.mock.calls[0][0];
    var refine = firstRenderingOptions.refine,
        items = firstRenderingOptions.items;


    refine(items[0].value);

    expect(helper.state.page).toBe(0);
  });
});