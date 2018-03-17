'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _enzyme = require('enzyme');

var _GeoSearchButton = require('../GeoSearchButton');

var _GeoSearchButton2 = _interopRequireDefault(_GeoSearchButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GeoSearchButton', function () {
  var defaultProps = {
    className: 'button',
    onClick: function onClick() {}
  };

  it('expect to render', function () {
    var props = _extends({}, defaultProps);

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchButton2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render disabled', function () {
    var props = _extends({}, defaultProps, {
      disabled: true
    });

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchButton2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to call onClick when button is clicked', function () {
    var props = _extends({}, defaultProps, {
      onClick: jest.fn()
    });

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchButton2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(props.onClick).not.toHaveBeenCalled();

    wrapper.find('button').simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});