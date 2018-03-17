'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _RefinementListItem = require('../RefinementListItem');

var _RefinementListItem2 = _interopRequireDefault(_RefinementListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('RefinementListItem', function () {
  var props = {
    facetValue: 'Hello',
    facetValueToRefine: 'wi',
    isRefined: false,
    handleClick: jest.fn(),
    itemClassName: 'item class',
    templateData: { template: 'data' },
    templateKey: 'item key',
    templateProps: { template: 'props' },
    subItems: _react2.default.createElement('div', null)
  };

  it('renders an item', function () {
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(_RefinementListItem2.default, props));
    expect(wrapper).toMatchSnapshot();
  });

  it('calls the right function', function () {
    var out = render(props);
    out.simulate('click');
    expect(props.handleClick).toHaveBeenCalledTimes(1);
  });

  function render(askedProps) {
    return (0, _enzyme.shallow)(_react2.default.createElement(_RefinementListItem2.default, askedProps));
  }
});