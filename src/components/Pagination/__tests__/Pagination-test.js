'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _Pagination = require('../Pagination');

var _Paginator = require('../../../connectors/pagination/Paginator');

var _Paginator2 = _interopRequireDefault(_Paginator);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Pagination', function () {
  var pager = new _Paginator2.default({
    currentPage: 0,
    total: 20,
    padding: 3
  });
  var defaultProps = {
    cssClasses: {
      root: 'root',
      item: 'item',
      page: 'page',
      previous: 'previous',
      next: 'next',
      first: 'first',
      last: 'last',
      active: 'active',
      disabled: 'disabled'
    },
    createURL: function createURL() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return JSON.stringify(args);
    },
    labels: { first: '', last: '', next: '', previous: '' },
    currentPage: 0,
    nbHits: 200,
    pages: pager.pages(),
    isFirstPage: pager.isFirstPage(),
    isLastPage: pager.isLastPage(),
    nbPages: 20,
    padding: 3,
    setCurrentPage: function setCurrentPage() {}
  };

  it('should render five elements', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Pagination.RawPagination, defaultProps)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display the first/last link', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Pagination.RawPagination, _extends({}, defaultProps, { showFirstLast: true }))).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should disable last page if already on it', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Pagination.RawPagination, _extends({}, defaultProps, {
      showFirstLast: true,
      pages: [13, 14, 15, 16, 17, 18, 19],
      currentPage: 19,
      isFirstPage: false,
      isLastPage: true
    }))).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should handle special clicks', function () {
    var props = {
      setCurrentPage: _sinon2.default.spy()
    };
    var preventDefault = _sinon2.default.spy();
    var component = new _Pagination.RawPagination(props);
    ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].forEach(function (e) {
      var event = { preventDefault: preventDefault };
      event[e] = true;
      component.handleClick(42, event);
      expect(props.setCurrentPage.called).toBe(false, 'setCurrentPage never called');
      expect(preventDefault.called).toBe(false, 'preventDefault never called');
    });
    component.handleClick(42, { preventDefault: preventDefault });
    expect(props.setCurrentPage.calledOnce).toBe(true, 'setCurrentPage called once');
    expect(preventDefault.calledOnce).toBe(true, 'preventDefault called once');
  });

  it('should have all buttons disabled if there are no results', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Pagination.RawPagination, _extends({}, defaultProps, {
      showFirstLast: true,
      currentPage: 0,
      nbHits: 0,
      nbPages: 0,
      pages: [0]
    }))).toJSON();
    expect(tree).toMatchSnapshot();
  });
});