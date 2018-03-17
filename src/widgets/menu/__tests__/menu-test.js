'use strict';

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('menu', function () {
  it('throws an exception when no attributeName', function () {
    var container = document.createElement('div');
    expect(_menu2.default.bind(null, { container: container })).toThrow(/^Usage/);
  });

  it('throws an exception when no container', function () {
    var attributeName = '';
    expect(_menu2.default.bind(null, { attributeName: attributeName })).toThrow(/^Usage/);
  });

  it('snapshot', function () {
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
    _menu2.default.__Rewire__('render', ReactDOM.render);
    var widget = (0, _menu2.default)({
      container: document.createElement('div'),
      attributeName: 'test'
    });
    var instantSearchInstance = { templatesConfig: undefined };
    widget.init({ helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, createURL: createURL, state: state });
    expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    _menu2.default.__ResetDependency__('render');
  });
});