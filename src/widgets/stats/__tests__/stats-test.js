'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _stats = require('../stats');

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instantSearchInstance = { templatesConfig: undefined };

describe('stats call', function () {
  it('should throw when called without container', function () {
    (0, _expect2.default)(function () {
      return (0, _stats2.default)();
    }).toThrow(/^Usage:/);
  });
});

describe('stats()', function () {
  var ReactDOM = void 0;
  var container = void 0;
  var widget = void 0;
  var results = void 0;

  beforeEach(function () {
    ReactDOM = { render: _sinon2.default.spy() };
    _stats2.default.__Rewire__('render', ReactDOM.render);

    container = document.createElement('div');
    widget = (0, _stats2.default)({ container: container, cssClasses: { body: ['body', 'cx'] } });
    results = {
      hits: [{}, {}],
      nbHits: 20,
      page: 0,
      nbPages: 10,
      hitsPerPage: 2,
      processingTimeMS: 42,
      query: 'a query'
    };

    widget.init({
      helper: { state: {} },
      instantSearchInstance: instantSearchInstance
    });
  });

  it('configures nothing', function () {
    (0, _expect2.default)(widget.getConfiguration).toEqual(undefined);
  });

  it('calls twice ReactDOM.render(<Stats props />, container)', function () {
    widget.render({ results: results, instantSearchInstance: instantSearchInstance });
    widget.render({ results: results, instantSearchInstance: instantSearchInstance });
    (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
    (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(container);
    (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
    (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(container);
  });

  afterEach(function () {
    _stats2.default.__ResetDependency__('render');
    _stats2.default.__ResetDependency__('autoHideContainerHOC');
    _stats2.default.__ResetDependency__('headerFooterHOC');
  });
});