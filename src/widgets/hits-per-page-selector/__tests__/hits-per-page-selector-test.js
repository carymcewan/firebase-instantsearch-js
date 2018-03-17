'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _hitsPerPageSelector = require('../hits-per-page-selector');

var _hitsPerPageSelector2 = _interopRequireDefault(_hitsPerPageSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('hitsPerPageSelector call', function () {
  it('throws an exception when no items', function () {
    var container = document.createElement('div');
    expect(_hitsPerPageSelector2.default.bind(null, { container: container })).toThrow(/^Usage:/);
  });

  it('throws an exception when no container', function () {
    var items = { a: { value: 'value', label: 'My value' } };
    expect(_hitsPerPageSelector2.default.bind(null, { items: items })).toThrow(/^Usage:/);
  });
});

describe('hitsPerPageSelector()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var items = void 0;
  var cssClasses = void 0;
  var widget = void 0;
  var helper = void 0;
  var results = void 0;
  var consoleWarn = void 0;
  var state = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };

    _hitsPerPageSelector2.default.__Rewire__('render', ReactDOM.render);
    consoleWarn = _sinon2.default.stub(window.console, 'warn');

    container = document.createElement('div');
    items = [{ value: 10, label: '10 results' }, { value: 20, label: '20 results' }];
    cssClasses = {
      root: ['custom-root', 'cx'],
      select: 'custom-select',
      item: 'custom-item'
    };
    widget = (0, _hitsPerPageSelector2.default)({ container: container, items: items, cssClasses: cssClasses });
    helper = {
      state: {
        hitsPerPage: 20
      },
      setQueryParameter: _sinon2.default.stub().returnsThis(),
      search: _sinon2.default.spy()
    };
    state = {
      hitsPerPage: 10
    };
    results = {
      hits: [],
      nbHits: 0
    };
  });

  it('does not configure the default hits per page if not specified', function () {
    expect(_typeof(widget.getConfiguration)).toEqual('function');
    expect(widget.getConfiguration()).toEqual({});
  });

  it('does configures the default hits per page if specified', function () {
    var widgetWithDefaults = (0, _hitsPerPageSelector2.default)({
      container: document.createElement('div'),
      items: [{ value: 10, label: '10 results' }, { value: 20, label: '20 results', default: true }]
    });

    expect(widgetWithDefaults.getConfiguration()).toEqual({
      hitsPerPage: 20
    });
  });

  it('calls twice ReactDOM.render(<Selector props />, container)', function () {
    widget.init({ helper: helper, state: helper.state });
    widget.render({ results: results, state: state });
    widget.render({ results: results, state: state });
    expect(ReactDOM.render.callCount).toBe(2);
    expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
  });

  it('sets the underlying hitsPerPage', function () {
    widget.init({ helper: helper, state: helper.state });
    widget.setHitsPerPage(helper, helper.state, 10);
    expect(helper.setQueryParameter.calledOnce).toBe(true, 'setQueryParameter called once');
    expect(helper.search.calledOnce).toBe(true, 'search called once');
  });

  it('should throw if there is no name attribute in a passed object', function () {
    items.length = 0;
    items.push({ label: 'Label without a value' });
    widget.init({ state: helper.state, helper: helper });
    expect(consoleWarn.calledOnce).toBe(true, 'console.warn called once');
    expect(consoleWarn.firstCall.args[0]).toEqual('[Warning][hitsPerPageSelector] No item in `items`\n  with `value: hitsPerPage` (hitsPerPage: 20)');
  });

  it('must include the current hitsPerPage at initialization time', function () {
    helper.state.hitsPerPage = -1;
    widget.init({ state: helper.state, helper: helper });
    expect(consoleWarn.calledOnce).toBe(true, 'console.warn called once');
    expect(consoleWarn.firstCall.args[0]).toEqual('[Warning][hitsPerPageSelector] No item in `items`\n  with `value: hitsPerPage` (hitsPerPage: -1)');
  });

  it('should not throw an error if state does not have a `hitsPerPage`', function () {
    delete helper.state.hitsPerPage;
    expect(function () {
      widget.init({ state: helper.state, helper: helper });
    }).not.toThrow(/No item in `items`/);
  });

  afterEach(function () {
    _hitsPerPageSelector2.default.__ResetDependency__('render');
    consoleWarn.restore();
  });
});