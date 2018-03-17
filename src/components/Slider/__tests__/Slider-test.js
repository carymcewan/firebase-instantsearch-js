'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _shallow = require('react-test-renderer/shallow');

var _Slider = require('../Slider');

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Slider', function () {
  it('expect to render correctly', function () {
    var tree = (0, _shallow.createRenderer)().render(_react2.default.createElement(_Slider2.default, {
      refine: function refine() {
        return undefined;
      },
      min: 0,
      max: 500,
      values: [0, 0],
      pips: true,
      step: 2,
      tooltips: true,
      shouldAutoHideContainer: false
    }));
    expect(tree).toMatchSnapshot();
  });

  it('expect to render collapsed', function () {
    var tree = (0, _shallow.createRenderer)().render(_react2.default.createElement(_Slider2.default, {
      refine: function refine() {
        return undefined;
      },
      min: 0,
      max: 500,
      values: [0, 0],
      pips: true,
      step: 2,
      tooltips: true,
      collapsible: { collapsed: true },
      shouldAutoHideContainer: false
    }));
    expect(tree).toMatchSnapshot();
  });

  it('expect to render without pips', function () {
    var tree = (0, _shallow.createRenderer)().render(_react2.default.createElement(_Slider2.default, {
      refine: function refine() {
        return undefined;
      },
      min: 0,
      max: 500,
      values: [0, 0],
      pips: false,
      step: 2,
      tooltips: true,
      shouldAutoHideContainer: false
    }));
    expect(tree).toMatchSnapshot();
  });

  it('expect to call handleChange on change', function () {
    var props = {
      refine: jest.fn(),
      min: 0,
      max: 500,
      values: [0, 0],
      pips: true,
      step: 2,
      tooltips: true,
      shouldAutoHideContainer: false
    };

    (0, _enzyme.shallow)(_react2.default.createElement(_Slider.RawSlider, props)).find('Rheostat').simulate('change', {
      values: [0, 100]
    });

    expect(props.refine).toHaveBeenCalledWith([0, 100]);
  });
});