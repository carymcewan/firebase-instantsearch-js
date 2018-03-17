'use strict';

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectNumericSelector = require('../connectNumericSelector.js');

var _connectNumericSelector2 = _interopRequireDefault(_connectNumericSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectNumericSelector', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericSelector2.default)(rendering);
    var listOptions = [{ name: '10', value: 10 }, { name: '20', value: 20 }, { name: '30', value: 30 }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

    var config = widget.getConfiguration({}, {});
    expect(config).toEqual({
      numericRefinements: {
        numerics: {
          '=': [listOptions[0].value]
        }
      }
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
    expect(rendering).toHaveBeenLastCalledWith(expect.any(Object), true);

    var firstRenderingOptions = rendering.mock.calls[0][0];
    expect(firstRenderingOptions.currentRefinement).toBe(listOptions[0].value);
    expect(firstRenderingOptions.widgetParams).toEqual({
      attributeName: 'numerics',
      options: listOptions
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
    expect(rendering).toHaveBeenCalledTimes(2);
    expect(rendering).toHaveBeenLastCalledWith(expect.any(Object), false);

    var secondRenderingOptions = rendering.mock.calls[1][0];
    expect(secondRenderingOptions.currentRefinement).toBe(listOptions[0].value);
    expect(secondRenderingOptions.widgetParams).toEqual({
      attributeName: 'numerics',
      options: listOptions
    });
  });

  it('Reads the default value from the URL if possible', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericSelector2.default)(rendering);
    var listOptions = [{ name: '10', value: 10 }, { name: '20', value: 20 }, { name: '30', value: 30 }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

    expect(widget.getConfiguration({}, {})).toEqual({
      numericRefinements: {
        numerics: {
          '=': [listOptions[0].value]
        }
      }
    });

    expect(widget.getConfiguration({}, {
      numericRefinements: {
        numerics: {
          '=': [30]
        }
      }
    })).toEqual({
      numericRefinements: {
        numerics: {
          '=': [30]
        }
      }
    });
  });

  it('Provide a function to update the refinements at each step', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericSelector2.default)(rendering);
    var listOptions = [{ name: '10', value: 10 }, { name: '20', value: 20 }, { name: '30', value: 30 }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

    var config = widget.getConfiguration({}, {});
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

    var firstRenderingOptions = rendering.mock.calls[0][0];
    var refine = firstRenderingOptions.refine;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });
    refine(listOptions[1].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [20]
    });
    refine(listOptions[2].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [30]
    });
    refine(listOptions[0].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.mock.calls[1][0];
    var renderSetValue = secondRenderingOptions.refine;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });
    renderSetValue(listOptions[1].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [20]
    });
    renderSetValue(listOptions[2].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [30]
    });
    renderSetValue(listOptions[0].name);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });
  });

  it('provides isRefined for the currently selected value', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericSelector2.default)(rendering);
    var listOptions = [{ name: '10', value: 10 }, { name: '20', value: 20 }, { name: '30', value: 30 }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

    var config = widget.getConfiguration({}, {});
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

    var refine = rendering.mock.calls[0][0].refine;

    listOptions.forEach(function (_, i) {
      // we loop with 1 increment because the first value is selected by default
      var currentOption = listOptions[(i + 1) % listOptions.length];
      refine(currentOption.name);

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
      var expectedResult = currentOption.value;

      var renderingParameters = rendering.mock.calls[1 + i][0];
      expect(renderingParameters.currentRefinement).toEqual(expectedResult);

      refine = renderingParameters.refine;
    });
  });

  it('The refine function can unselect with `undefined` and "undefined"', function () {
    var rendering = jest.fn();
    var makeWidget = (0, _connectNumericSelector2.default)(rendering);
    var listOptions = [{ name: '' }, { name: '10', value: 10 }, { name: '20', value: 20 }, { name: '30', value: 30 }];
    var widget = makeWidget({
      attributeName: 'numerics',
      options: listOptions
    });

    var config = widget.getConfiguration({}, {});
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

    var firstRenderingOptions = rendering.mock.calls[0][0];
    var refine = firstRenderingOptions.refine;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
    refine(listOptions[1].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });
    refine(listOptions[0].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({});

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.mock.calls[1][0];
    var refineBis = secondRenderingOptions.refine;

    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
    refineBis(listOptions[1].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({
      '=': [10]
    });
    refineBis(listOptions[0].value);
    expect(helper.state.getNumericRefinements('numerics')).toEqual({});
  });
});