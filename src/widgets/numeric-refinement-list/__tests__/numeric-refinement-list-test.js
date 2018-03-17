'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _numericRefinementList = require('../numeric-refinement-list.js');

var _numericRefinementList2 = _interopRequireDefault(_numericRefinementList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encodeValue = function encodeValue(start, end) {
  return window.encodeURI(JSON.stringify({ start: start, end: end }));
};

describe('numericRefinementList call', function () {
  it('throws an exception when no container', function () {
    var attributeName = '';
    var options = [];
    (0, _expect2.default)(_numericRefinementList2.default.bind(null, { attributeName: attributeName, options: options })).toThrow(/^Usage/);
  });

  it('throws an exception when no attributeName', function () {
    var container = document.createElement('div');
    var options = [];
    (0, _expect2.default)(_numericRefinementList2.default.bind(null, { container: container, options: options })).toThrow(/^Usage/);
  });

  it('throws an exception when no options', function () {
    var container = document.createElement('div');
    var attributeName = '';
    (0, _expect2.default)(_numericRefinementList2.default.bind(null, { attributeName: attributeName, container: container })).toThrow(/^Usage/);
  });
});

describe('numericRefinementList()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var widget = void 0;
  var helper = void 0;

  var options = void 0;
  var results = void 0;
  var createURL = void 0;
  var state = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };
    _numericRefinementList2.default.__Rewire__('render', ReactDOM.render);

    options = [{ name: 'All' }, { end: 4, name: 'less than 4' }, { start: 4, end: 4, name: '4' }, { start: 5, end: 10, name: 'between 5 and 10' }, { start: 10, name: 'more than 10' }];

    container = document.createElement('div');
    widget = (0, _numericRefinementList2.default)({
      container: container,
      attributeName: 'price',
      options: options,
      cssClasses: { root: ['root', 'cx'] }
    });
    helper = {
      state: {
        getNumericRefinements: _sinon2.default.stub().returns([])
      },
      addNumericRefinement: _sinon2.default.spy(),
      search: _sinon2.default.spy(),
      setState: _sinon2.default.stub().returnsThis()
    };
    state = {
      getNumericRefinements: _sinon2.default.stub().returns([]),
      clearRefinements: _sinon2.default.stub().returnsThis(),
      addNumericRefinement: _sinon2.default.stub().returnsThis()
    };
    results = {
      hits: []
    };

    helper.state.clearRefinements = _sinon2.default.stub().returns(helper.state);
    helper.state.addNumericRefinement = _sinon2.default.stub().returns(helper.state);
    createURL = function createURL() {
      return '#';
    };
    widget.init({ helper: helper, instantSearchInstance: {} });
  });

  it('calls twice ReactDOM.render(<RefinementList props />, container)', function () {
    widget.render({ state: state, results: results, createURL: createURL });
    widget.render({ state: state, results: results, createURL: createURL });

    (0, _expect2.default)(ReactDOM.render.callCount).toBe(2);
    (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
    (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
  });

  it("doesn't call the refinement functions if not refined", function () {
    widget.render({ state: state, results: results, createURL: createURL });
    (0, _expect2.default)(helper.state.clearRefinements.called).toBe(false, 'clearRefinements called one');
    (0, _expect2.default)(helper.state.addNumericRefinement.called).toBe(false, 'addNumericRefinement never called');
    (0, _expect2.default)(helper.search.called).toBe(false, 'search never called');
  });

  it('calls the refinement functions if refined with "4"', function () {
    widget._refine(encodeValue(4, 4));
    (0, _expect2.default)(helper.state.clearRefinements.calledOnce).toBe(true, 'clearRefinements called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.calledOnce).toBe(true, 'addNumericRefinement called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.getCall(0).args).toEqual(['price', '=', 4]);
    (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'search called once');
  });

  it('calls the refinement functions if refined with "between 5 and 10"', function () {
    widget._refine(encodeValue(5, 10));
    (0, _expect2.default)(helper.state.clearRefinements.calledOnce).toBe(true, 'clearRefinements called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.calledTwice).toBe(true, 'addNumericRefinement called twice');
    (0, _expect2.default)(helper.state.addNumericRefinement.getCall(0).args).toEqual(['price', '>=', 5]);
    (0, _expect2.default)(helper.state.addNumericRefinement.getCall(1).args).toEqual(['price', '<=', 10]);
    (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'search called once');
  });

  it('calls two times the refinement functions if refined with "less than 4"', function () {
    widget._refine(encodeValue(undefined, 4));
    (0, _expect2.default)(helper.state.clearRefinements.calledOnce).toBe(true, 'clearRefinements called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.calledOnce).toBe(true, 'addNumericRefinement called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.getCall(0).args).toEqual(['price', '<=', 4]);
    (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'search called once');
  });

  it('calls two times the refinement functions if refined with "more than 10"', function () {
    widget._refine(encodeValue(10));
    (0, _expect2.default)(helper.state.clearRefinements.calledOnce).toBe(true, 'clearRefinements called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.calledOnce).toBe(true, 'addNumericRefinement called once');
    (0, _expect2.default)(helper.state.addNumericRefinement.getCall(0).args).toEqual(['price', '>=', 10]);
    (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'search called once');
  });

  it('does not alter the initial options when rendering', function () {
    // Note: https://github.com/algolia/instantsearch.js/issues/1010
    // Make sure we work on a copy of the initial facetValues when rendering,
    // not directly editing it

    // Given
    var initialOptions = [{ start: 0, end: 5, name: '1-5' }];
    var initialOptionsClone = (0, _cloneDeep2.default)(initialOptions);
    var testWidget = (0, _numericRefinementList2.default)({
      container: container,
      attributeName: 'price',
      options: initialOptions
    });

    // The life cycle impose all the steps
    testWidget.init({ helper: helper, createURL: function createURL() {
        return '';
      }, instantSearchInstance: {} });

    // When
    testWidget.render({ state: state, results: results, createURL: createURL });

    // Then
    (0, _expect2.default)(initialOptions).toEqual(initialOptionsClone);
  });

  afterEach(function () {
    _numericRefinementList2.default.__ResetDependency__('render');
    _numericRefinementList2.default.__ResetDependency__('autoHideContainerHOC');
    _numericRefinementList2.default.__ResetDependency__('headerFooterHOC');
  });
});