'use strict';

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _rangeInput = require('../range-input.js');

var _rangeInput2 = _interopRequireDefault(_rangeInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('preact-compat', function () {
  var module = require.requireActual('preact-compat');

  module.render = jest.fn();

  return module;
});

describe('rangeInput', function () {
  var attributeName = 'aNumAttr';
  var createContainer = function createContainer() {
    return document.createElement('div');
  };
  var instantSearchInstance = { templatesConfig: undefined };
  var createHelper = function createHelper() {
    return new _algoliasearchHelper2.default({
      search: function search() {},
      addAlgoliaAgent: function addAlgoliaAgent() {
        return {};
      }
    }, 'indexName', { disjunctiveFacets: [attributeName] });
  };

  afterEach(function () {
    _preactCompat2.default.render.mockReset();
  });

  it('expect to render with results', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = {
      disjunctiveFacets: [{
        name: attributeName,
        stats: {
          min: 10,
          max: 500
        }
      }]
    };

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0].props.min).toBe(10);
    expect(_preactCompat2.default.render.mock.calls[0][0].props.max).toBe(500);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
  });

  it('expect to render without results', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
  });

  it('expect to render with custom classNames', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      cssClasses: {
        root: 'custom-root',
        header: 'custom-header',
        body: 'custom-body',
        form: 'custom-form',
        fieldset: 'custom-fieldset',
        labelMin: 'custom-labelMin',
        inputMin: 'custom-inputMin',
        separator: 'custom-separator',
        labelMax: 'custom-labelMax',
        inputMax: 'custom-inputMax',
        submit: 'custom-submit',
        footer: 'custom-footer'
      }
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
  });

  it('expect to render with custom labels', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      labels: {
        separator: 'custom-separator',
        submit: 'custom-submit'
      }
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
  });

  it('expect to render with min', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      min: 20
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0].props.min).toBe(20);
  });

  it('expect to render with max', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      max: 480
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0].props.max).toBe(480);
  });

  it('expect to render with refinement', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = {
      disjunctiveFacets: [{
        name: attributeName,
        stats: {
          min: 10,
          max: 500
        }
      }]
    };

    helper.addNumericRefinement(attributeName, '>=', 25);
    helper.addNumericRefinement(attributeName, '<=', 475);

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
    expect(_preactCompat2.default.render.mock.calls[0][0].props.values).toEqual({
      min: 25,
      max: 475
    });
  });

  it('expect to render with refinement at boundaries', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = {};

    helper.addNumericRefinement(attributeName, '>=', 10);
    helper.addNumericRefinement(attributeName, '<=', 500);

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      min: 10,
      max: 500
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
    expect(_preactCompat2.default.render.mock.calls[0][0]).toMatchSnapshot();
    expect(_preactCompat2.default.render.mock.calls[0][0].props.values).toEqual({
      min: undefined,
      max: undefined
    });
  });

  it('expect to render hidden', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName,
      min: 20,
      max: 20
    });

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    expect(_preactCompat2.default.render.mock.calls[0][0].props.shouldAutoHideContainer).toBe(true);
  });

  it('expect to call refine', function () {
    var container = createContainer();
    var helper = createHelper();
    var results = [];
    var refine = jest.fn();

    var widget = (0, _rangeInput2.default)({
      container: container,
      attributeName: attributeName
    });

    // Override _refine behavior to be able to check
    // if refine is correctly passed to the component
    widget._refine = function () {
      return refine;
    };

    widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, helper: helper });

    _preactCompat2.default.render.mock.calls[0][0].props.refine([25, 475]);

    expect(refine).toHaveBeenCalledWith([25, 475]);
  });

  describe('precision', function () {
    it('expect to render with default precision', function () {
      var container = createContainer();
      var helper = createHelper();
      var results = [];

      var widget = (0, _rangeInput2.default)({
        container: container,
        attributeName: attributeName,
        precision: 2
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: results, helper: helper });

      expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
      expect(_preactCompat2.default.render.mock.calls[0][0].props.step).toBe(0.01);
    });

    it('expect to render with precision of 0', function () {
      var container = createContainer();
      var helper = createHelper();
      var results = [];

      var widget = (0, _rangeInput2.default)({
        container: container,
        attributeName: attributeName,
        precision: 0
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: results, helper: helper });

      expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
      expect(_preactCompat2.default.render.mock.calls[0][0].props.step).toBe(1);
    });

    it('expect to render with precision of 1', function () {
      var container = createContainer();
      var helper = createHelper();
      var results = [];

      var widget = (0, _rangeInput2.default)({
        container: container,
        attributeName: attributeName,
        precision: 1
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: results, helper: helper });

      expect(_preactCompat2.default.render).toHaveBeenCalledTimes(1);
      expect(_preactCompat2.default.render.mock.calls[0][0].props.step).toBe(0.1);
    });
  });

  describe('throws', function () {
    it('throws an exception when no container', function () {
      expect(function () {
        return (0, _rangeInput2.default)({ attributeName: '' });
      }).toThrow(/^Usage:/);
    });

    it('throws an exception when no attributeName', function () {
      expect(function () {
        return (0, _rangeInput2.default)({
          container: document.createElement('div')
        });
      }).toThrow(/^Usage:/);
    });
  });
});