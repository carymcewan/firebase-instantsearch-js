'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _RefinementList = require('../RefinementList');

var _RefinementListItem = require('../RefinementListItem');

var _RefinementListItem2 = _interopRequireDefault(_RefinementListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
  templateProps: {},
  toggleRefinement: function toggleRefinement() {}
};

describe('RefinementList', function () {
  var createURL = void 0;

  function shallowRender() {
    var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    createURL = _sinon2.default.spy();
    var props = _extends({}, defaultProps, {
      createURL: createURL,
      facetValues: []
    }, extraProps);
    return (0, _enzyme.shallow)(_react2.default.createElement(_RefinementList.RawRefinementList, props));
  }

  describe('cssClasses', function () {
    it('should add the `list` class to the root element', function () {
      // Given
      var props = _extends({}, defaultProps, {
        cssClasses: {
          list: 'list'
        }
      });

      // When
      var actual = shallowRender(props);

      // Then
      (0, _expect2.default)(actual.hasClass('list')).toEqual(true);
    });

    it('should set item classes to the refinements', function () {
      // Given
      var props = _extends({}, defaultProps, {
        cssClasses: {
          item: 'item'
        },
        facetValues: [{ value: 'foo', isRefined: true }]
      });

      // When
      var actual = shallowRender(props).find(_RefinementListItem2.default);

      // Then
      (0, _expect2.default)(actual.props().itemClassName).toContain('item');
    });

    it('should set active classes to the active refinements', function () {
      // Given
      var props = _extends({}, defaultProps, {
        cssClasses: {
          active: 'active'
        },
        facetValues: [{ value: 'foo', isRefined: true }, { value: 'bar', isRefined: false }]
      });

      // When
      var activeItem = shallowRender(props).find({ isRefined: true });
      var inactiveItem = shallowRender(props).find({ isRefined: false });

      // Then
      (0, _expect2.default)(activeItem.props().itemClassName).toContain('active');
      (0, _expect2.default)(inactiveItem.props().itemClassName).not.toContain('active');
    });
  });

  describe('items', function () {
    it('should have the correct names', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', isRefined: false }, { value: 'bar', isRefined: false }]
      });

      // When
      var items = shallowRender(props).find(_RefinementListItem2.default);
      var firstItem = items.at(0);
      var secondItem = items.at(1);

      // Then
      (0, _expect2.default)(firstItem.props().facetValueToRefine).toEqual('foo');
      (0, _expect2.default)(secondItem.props().facetValueToRefine).toEqual('bar');
    });

    it('should correctly set if refined or not', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', isRefined: false }, { value: 'bar', isRefined: true }]
      });

      // When
      var items = shallowRender(props).find(_RefinementListItem2.default);
      var firstItem = items.at(0);
      var secondItem = items.at(1);

      // Then
      (0, _expect2.default)(firstItem.props().isRefined).toEqual(false);
      (0, _expect2.default)(secondItem.props().isRefined).toEqual(true);
    });
  });

  describe('count', function () {
    it('should pass the count to the templateData', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', count: 42, isRefined: false }, { value: 'bar', count: 16, isRefined: false }]
      });

      // When
      var items = shallowRender(props).find(_RefinementListItem2.default);
      var firstItem = items.at(0);
      var secondItem = items.at(1);

      // Then
      (0, _expect2.default)(firstItem.props().templateData.count).toEqual(42);
      (0, _expect2.default)(secondItem.props().templateData.count).toEqual(16);
    });
  });

  describe('showMore', function () {
    it('adds a showMore link when the feature is enabled', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', isRefined: false }, { value: 'bar', isRefined: false }, { value: 'baz', isRefined: false }],
        showMore: true,
        isShowingMore: false,
        canToggleShowMore: true
      });

      // When
      var root = shallowRender(props);
      var actual = root.find('[templateKey="show-more-inactive"]');

      // Then
      (0, _expect2.default)(actual).toHaveLength(1);
    });

    it('does not add a showMore link when the feature is disabled', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', isRefined: false }, { value: 'bar', isRefined: false }, { value: 'baz', isRefined: false }],
        showMore: false,
        isShowingMore: false
      });

      // When
      var root = shallowRender(props);
      var actual = root.find('Template').filter({ templateKey: 'show-more-inactive' });

      // Then
      (0, _expect2.default)(actual).toHaveLength(0);
    });

    it('should displays showLess', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{ value: 'foo', isRefined: false }, { value: 'bar', isRefined: false }, { value: 'baz', isRefined: false }],
        showMore: true,
        isShowingMore: true,
        canToggleShowMore: true
      });

      // When
      var root = shallowRender(props);
      var actual = root.find('[templateKey="show-more-active"]');

      // Then
      (0, _expect2.default)(actual).toHaveLength(1);
    });
  });

  describe('sublist', function () {
    it('should create a subList with the sub values', function () {
      // Given
      var props = _extends({}, defaultProps, {
        facetValues: [{
          value: 'foo',
          data: [{ value: 'bar', isRefined: false }, { value: 'baz', isRefined: false }],
          isRefined: false
        }]
      });

      // When
      var root = shallowRender(props);
      var mainItem = root.find(_RefinementListItem2.default).at(0);
      var subList = (0, _enzyme.shallow)(mainItem.props().subItems);
      var subItems = subList.find(_RefinementListItem2.default);

      // Then
      (0, _expect2.default)(mainItem.props().facetValueToRefine).toEqual('foo');
      (0, _expect2.default)(subItems.at(0).props().facetValueToRefine).toEqual('bar');
      (0, _expect2.default)(subItems.at(1).props().facetValueToRefine).toEqual('baz');
    });

    it('should add depth class for each depth', function () {
      // Given
      var props = _extends({}, defaultProps, {
        cssClasses: {
          depth: 'depth-'
        },
        facetValues: [{
          value: 'foo',
          data: [{ value: 'bar', isRefined: false }, { value: 'baz', isRefined: false }],
          isRefined: false
        }]
      });

      // When
      var root = shallowRender(props);
      var mainItem = root.find(_RefinementListItem2.default).at(0);
      var subList = (0, _enzyme.shallow)(mainItem.props().subItems);

      // Then
      (0, _expect2.default)(root.props().className).toContain('depth-0');
      (0, _expect2.default)(subList.props().className).toContain('depth-1');
    });
  });
});