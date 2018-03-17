'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _hits = require('../hits.js');

var _hits2 = _interopRequireDefault(_hits);

var _defaultTemplates = require('../defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('hits call', function () {
  it('throws an exception when no container', function () {
    (0, _expect2.default)(_hits2.default).toThrow();
  });
});

describe('hits()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var templateProps = void 0;
  var widget = void 0;
  var results = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };
    _hits2.default.__Rewire__('render', ReactDOM.render);

    container = document.createElement('div');
    templateProps = {
      transformData: undefined,
      templatesConfig: undefined,
      templates: _defaultTemplates2.default,
      useCustomCompileOptions: { item: false, empty: false }
    };
    widget = (0, _hits2.default)({ container: container, cssClasses: { root: ['root', 'cx'] } });
    widget.init({ instantSearchInstance: { templateProps: templateProps } });
    results = { hits: [{ first: 'hit', second: 'hit' }] };
  });

  it('calls twice ReactDOM.render(<Hits props />, container)', function () {
    widget.render({ results: results });
    widget.render({ results: results });

    (0, _expect2.default)(ReactDOM.render.callCount).toBe(2);
    (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
    (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
  });

  it('does not accept both item and allItems templates', function () {
    (0, _expect2.default)(_hits2.default.bind({ container: container, templates: { item: '', allItems: '' } })).toThrow();
  });

  afterEach(function () {
    _hits2.default.__ResetDependency__('render');
  });
});