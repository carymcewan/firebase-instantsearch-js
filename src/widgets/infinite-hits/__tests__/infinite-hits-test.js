'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _infiniteHits = require('../infinite-hits');

var _infiniteHits2 = _interopRequireDefault(_infiniteHits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('infiniteHits call', function () {
  it('throws an exception when no container', function () {
    (0, _expect2.default)(_infiniteHits2.default).toThrow();
  });
});

describe('infiniteHits()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var widget = void 0;
  var results = void 0;
  var helper = void 0;

  beforeEach(function () {
    helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
    helper.search = _sinon2.default.spy();

    ReactDOM = { render: _sinon2.default.spy() };
    _infiniteHits2.default.__Rewire__('render', ReactDOM.render);

    container = document.createElement('div');
    widget = (0, _infiniteHits2.default)({
      container: container,
      escapeHits: true,
      cssClasses: { root: ['root', 'cx'] }
    });
    widget.init({ helper: helper, instantSearchInstance: {} });
    results = { hits: [{ first: 'hit', second: 'hit' }] };
  });

  it('It does have a specific configuration', function () {
    (0, _expect2.default)(widget.getConfiguration()).toEqual({
      highlightPostTag: '__/ais-highlight__',
      highlightPreTag: '__ais-highlight__'
    });
  });

  it('calls twice ReactDOM.render(<Hits props />, container)', function () {
    var state = { page: 0 };
    widget.render({ results: results, state: state });
    widget.render({ results: results, state: state });

    (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
    (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
    (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
  });

  it('if it is the last page, then the props should contain isLastPage true', function () {
    var state = { page: 0 };
    widget.render({
      results: _extends({}, results, { page: 0, nbPages: 2 }),
      state: state
    });
    widget.render({
      results: _extends({}, results, { page: 1, nbPages: 2 }),
      state: state
    });

    (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
    (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
    (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
  });

  it('does not accept both item and allItems templates', function () {
    (0, _expect2.default)(_infiniteHits2.default.bind({ container: container, templates: { item: '', allItems: '' } })).toThrow();
  });

  it('updates the search state properly when showMore is called', function () {
    (0, _expect2.default)(helper.state.page).toBe(0);

    widget.showMore();

    (0, _expect2.default)(helper.state.page).toBe(1);
    (0, _expect2.default)(helper.search.callCount).toBe(1);
  });

  afterEach(function () {
    _infiniteHits2.default.__ResetDependency__('render');
    _infiniteHits2.default.__ResetDependency__('defaultTemplates');
  });
});