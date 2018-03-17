'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _priceRanges = require('../price-ranges.js');

var _priceRanges2 = _interopRequireDefault(_priceRanges);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instantSearchInstance = { templatesConfig: undefined };

describe('priceRanges call', function () {
  it('throws an exception when no container', function () {
    var attributeName = '';
    (0, _expect2.default)(_priceRanges2.default.bind(null, { attributeName: attributeName })).toThrow(/^Usage:/);
  });

  it('throws an exception when no attributeName', function () {
    var container = document.createElement('div');
    (0, _expect2.default)(_priceRanges2.default.bind(null, { container: container })).toThrow(/^Usage:/);
  });
});

describe('priceRanges()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var widget = void 0;
  var results = void 0;
  var helper = void 0;
  var state = void 0;
  var createURL = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };

    _priceRanges2.default.__Rewire__('render', ReactDOM.render);

    container = document.createElement('div');
    widget = (0, _priceRanges2.default)({
      container: container,
      attributeName: 'aNumAttr',
      cssClasses: { root: ['root', 'cx'] }
    });
    results = {
      hits: [1],
      nbHits: 1,
      getFacetStats: _sinon2.default.stub().returns({
        min: 1.99,
        max: 4999.98,
        avg: 243.349,
        sum: 2433490.0
      })
    };
  });

  it('adds the attribute as a facet', function () {
    (0, _expect2.default)(widget.getConfiguration()).toEqual({ facets: ['aNumAttr'] });
  });

  describe('without refinements', function () {
    beforeEach(function () {
      helper = {
        getRefinements: _sinon2.default.stub().returns([]),
        clearRefinements: _sinon2.default.spy(),
        addNumericRefinement: _sinon2.default.spy(),
        search: _sinon2.default.spy()
      };

      state = {
        clearRefinements: _sinon2.default.stub().returnsThis(),
        addNumericRefinement: _sinon2.default.stub().returnsThis()
      };

      createURL = _sinon2.default.stub().returns('#createURL');

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
    });

    it('calls twice ReactDOM.render(<PriceRanges props />, container)', function () {
      widget.render({ results: results, helper: helper, state: state, createURL: createURL });
      widget.render({ results: results, helper: helper, state: state, createURL: createURL });

      (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
      (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
      (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
    });

    it('calls getRefinements to check if there are some refinements', function () {
      widget.render({ results: results, helper: helper, state: state, createURL: createURL });
      (0, _expect2.default)(helper.getRefinements.calledOnce).toBe(true, 'getRefinements called once');
    });

    it('refines on the lower bound', function () {
      widget.refine({ from: 10, to: undefined });
      (0, _expect2.default)(helper.clearRefinements.calledOnce).toBe(true, 'helper.clearRefinements called once');
      (0, _expect2.default)(helper.addNumericRefinement.calledOnce).toBe(true, 'helper.addNumericRefinement called once');
      (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'helper.search called once');
    });

    it('refines on the upper bound', function () {
      widget.refine({ from: undefined, to: 10 });
      (0, _expect2.default)(helper.clearRefinements.calledOnce).toBe(true, 'helper.clearRefinements called once');
      (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'helper.search called once');
    });

    it('refines on the 2 bounds', function () {
      widget.refine({ from: 10, to: 20 });
      (0, _expect2.default)(helper.clearRefinements.calledOnce).toBe(true, 'helper.clearRefinements called once');
      (0, _expect2.default)(helper.addNumericRefinement.calledTwice).toBe(true, 'helper.addNumericRefinement called twice');
      (0, _expect2.default)(helper.search.calledOnce).toBe(true, 'helper.search called once');
    });
  });

  afterEach(function () {
    _priceRanges2.default.__ResetDependency__('render');
    _priceRanges2.default.__ResetDependency__('autoHideContainerHOC');
    _priceRanges2.default.__ResetDependency__('headerFooterHOC');
  });
});