'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _enzyme = require('enzyme');

var _GeoSearchToggle = require('../GeoSearchToggle');

var _GeoSearchToggle2 = _interopRequireDefault(_GeoSearchToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GeoSearchToggle', function () {
  var defaultProps = {
    classNameLabel: 'label',
    classNameInput: 'input',
    checked: false,
    onToggle: function onToggle() {}
  };

  it('expect to render', function () {
    var props = _extends({}, defaultProps);

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchToggle2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render checked', function () {
    var props = _extends({}, defaultProps, {
      checked: true
    });

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchToggle2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to call onToggle when the input changed', function () {
    var props = _extends({}, defaultProps, {
      onToggle: jest.fn()
    });

    var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(
      _GeoSearchToggle2.default,
      props,
      'Clear the current map refinement'
    ));

    expect(props.onToggle).not.toHaveBeenCalled();

    wrapper.find('input').simulate('change');

    expect(props.onToggle).toHaveBeenCalled();
  });
});