'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MenuSelect = require('../MenuSelect');

var _MenuSelect2 = _interopRequireDefault(_MenuSelect);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _defaultTemplates = require('../../widgets/menu-select/defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('MenuSelect', function () {
  it('should render <MenuSelect /> with items', function () {
    var props = {
      items: [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }],
      refine: function refine() {},
      templateProps: { templates: _defaultTemplates2.default },
      shouldAutoHideContainer: false
    };
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_MenuSelect2.default, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom css classes', function () {
    var props = {
      items: [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }],
      refine: function refine() {},
      templateProps: { templates: _defaultTemplates2.default },
      shouldAutoHideContainer: false,
      cssClasses: {
        select: 'foo',
        option: 'bar'
      }
    };
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_MenuSelect2.default, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});