'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Selector = require('../Selector');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Selector', function () {
  it('should render <Selector/> with strings', function () {
    var props = {
      currentValue: 'index-a',
      setValue: function setValue() {},
      cssClasses: {
        root: 'custom-root',
        select: 'custom-select',
        item: 'custom-item'
      },
      options: [{ value: 'index-a', label: 'Index A' }, { value: 'index-b', label: 'Index B' }]
    };
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Selector.RawSelector, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render <Selector/> with numbers', function () {
    var props = {
      currentValue: 10,
      setValue: function setValue() {},
      cssClasses: {
        root: 'custom-root',
        select: 'custom-select',
        item: 'custom-item'
      },
      options: [{ value: 10, label: '10 results per page' }, { value: 20, label: '20 results per page' }]
    };
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Selector.RawSelector, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});