'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _clearAll = require('../clear-all');

var _clearAll2 = _interopRequireDefault(_clearAll);

var _defaultTemplates = require('../defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('clearAll()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var widget = void 0;
  var props = void 0;
  var results = void 0;
  var helper = void 0;
  var createURL = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };
    createURL = _sinon2.default.stub().returns('#all-cleared');

    _clearAll2.default.__Rewire__('render', ReactDOM.render);

    container = document.createElement('div');
    widget = (0, _clearAll2.default)({
      container: container,
      autoHideContainer: true,
      cssClasses: { root: ['root', 'cx'] }
    });

    results = {};
    helper = {
      state: {
        clearRefinements: _sinon2.default.stub().returnsThis(),
        clearTags: _sinon2.default.stub().returnsThis()
      },
      search: _sinon2.default.spy()
    };

    props = {
      refine: _sinon2.default.spy(),
      cssClasses: {
        root: 'ais-clear-all root cx',
        header: 'ais-clear-all--header',
        body: 'ais-clear-all--body',
        footer: 'ais-clear-all--footer',
        link: 'ais-clear-all--link'
      },
      collapsible: false,
      hasRefinements: false,
      shouldAutoHideContainer: true,
      templateProps: {
        templates: _defaultTemplates2.default,
        templatesConfig: {},
        transformData: undefined,
        useCustomCompileOptions: { header: false, footer: false, link: false }
      },
      url: '#all-cleared'
    };
    widget.init({
      helper: helper,
      createURL: function createURL() {},
      instantSearchInstance: {
        templatesConfig: {}
      }
    });
  });

  it('configures nothing', function () {
    (0, _expect2.default)(widget.getConfiguration).toEqual(undefined);
  });

  describe('without refinements', function () {
    beforeEach(function () {
      helper.state.facetsRefinements = {};
      props.hasRefinements = false;
      props.shouldAutoHideContainer = true;
    });

    it('calls twice ReactDOM.render(<ClearAll props />, container)', function () {
      widget.render({
        results: results,
        helper: helper,
        state: helper.state,
        createURL: createURL,
        instantSearchInstance: {}
      });
      widget.render({
        results: results,
        helper: helper,
        state: helper.state,
        createURL: createURL,
        instantSearchInstance: {}
      });

      (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
      (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
      (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
    });
  });

  describe('with refinements', function () {
    beforeEach(function () {
      helper.state.facetsRefinements = ['something'];
      props.hasRefinements = true;
      props.shouldAutoHideContainer = false;
    });

    it('calls twice ReactDOM.render(<ClearAll props />, container)', function () {
      widget.render({ results: results, helper: helper, state: helper.state, createURL: createURL });
      widget.render({ results: results, helper: helper, state: helper.state, createURL: createURL });

      (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
      (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
      (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
    });
  });

  afterEach(function () {
    _clearAll2.default.__ResetDependency__('render');
    _clearAll2.default.__ResetDependency__('defaultTemplates');
  });
});