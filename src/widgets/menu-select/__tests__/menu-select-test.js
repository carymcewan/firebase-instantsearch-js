'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _menuSelect = require('../menu-select');

var _menuSelect2 = _interopRequireDefault(_menuSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('menuSelect', function () {
  it('throws an exception when no attributeName', function () {
    var container = document.createElement('div');
    expect(_menuSelect2.default.bind(null, { container: container })).toThrow(/^Usage/);
  });

  it('throws an exception when no container', function () {
    var attributeName = 'categories';
    expect(_menuSelect2.default.bind(null, { attributeName: attributeName })).toThrow(/^Usage/);
  });

  it('render correctly', function () {
    var data = { data: [{ name: 'foo' }, { name: 'bar' }] };
    var results = { getFacetValues: _sinon2.default.spy(function () {
        return data;
      }) };
    var state = { toggleRefinement: _sinon2.default.spy() };
    var helper = {
      toggleRefinement: _sinon2.default.stub().returnsThis(),
      search: _sinon2.default.spy(),
      state: state
    };
    var createURL = function createURL() {
      return '#';
    };
    var ReactDOM = { render: _sinon2.default.spy() };
    _menuSelect2.default.__Rewire__('render', ReactDOM.render);
    var widget = (0, _menuSelect2.default)({
      container: document.createElement('div'),
      attributeName: 'test'
    });
    var instantSearchInstance = { templatesConfig: undefined };
    widget.init({ helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, createURL: createURL, state: state });
    expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    _menuSelect2.default.__ResetDependency__('render');
  });
});