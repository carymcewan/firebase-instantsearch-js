'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _RangeInput = require('../RangeInput');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('RawRangeInput', function () {
  var defaultProps = {
    min: 0,
    max: 500,
    step: 1,
    values: {},
    cssClasses: {
      form: 'form',
      fieldset: 'fieldset',
      labelMin: 'labelMin',
      inputMin: 'inputMin',
      separator: 'separator',
      labelMax: 'labelMax',
      inputMax: 'inputMax',
      submit: 'submit'
    },
    labels: {
      separator: 'to',
      submit: 'Go'
    },
    refine: function refine() {}
  };

  var shallowRender = function shallowRender(props) {
    return (0, _enzyme.shallow)(_react2.default.createElement(_RangeInput.RawRangeInput, _extends({}, defaultProps, props)));
  };

  it('expect to render', function () {
    var props = {};
    var component = shallowRender(props);

    expect(component).toMatchSnapshot();
  });

  it('expect to render with values', function () {
    var props = {
      values: {
        min: 20,
        max: 480
      }
    };

    var component = shallowRender(props);

    expect(component).toMatchSnapshot();
    expect(component.state()).toEqual({
      min: 20,
      max: 480
    });
  });

  it('expect to render with disabled state', function () {
    var props = {
      min: 480,
      max: 20
    };

    var component = shallowRender(props);

    expect(component).toMatchSnapshot();
  });

  describe('willReceiveProps', function () {
    it('expect to update the empty state from given props', function () {
      var props = {};
      var nextProps = {
        values: {
          min: 20,
          max: 480
        }
      };

      var component = shallowRender(props);

      expect(component).toMatchSnapshot();

      component.instance().componentWillReceiveProps(nextProps);

      expect(component).toMatchSnapshot();
      expect(component.state()).toEqual({
        min: 20,
        max: 480
      });
    });

    it('expect to update the state from given props', function () {
      var props = {
        values: {
          min: 40,
          max: 460
        }
      };

      var nextProps = {
        values: {
          min: 20,
          max: 480
        }
      };

      var component = shallowRender(props);

      expect(component).toMatchSnapshot();

      component.instance().componentWillReceiveProps(nextProps);

      expect(component).toMatchSnapshot();
      expect(component.state()).toEqual({
        min: 20,
        max: 480
      });
    });
  });

  describe('onChange', function () {
    it('expect to update the state when min change', function () {
      var props = {};
      var component = shallowRender(props);

      component.find('input[type="number"]').first().simulate('change', {
        currentTarget: {
          value: 20
        }
      });

      expect(component).toMatchSnapshot();
      expect(component.state()).toEqual({
        min: 20
      });
    });

    it('expect to update the state when max change', function () {
      var props = {};
      var component = shallowRender(props);

      component.find('input[type="number"]').last().simulate('change', {
        currentTarget: {
          value: 480
        }
      });

      expect(component).toMatchSnapshot();
      expect(component.state()).toEqual({
        max: 480
      });
    });
  });

  describe('onSubmit', function () {
    it('expect to call refine with min, max as integer', function () {
      var props = {
        refine: jest.fn()
      };

      var event = {
        preventDefault: jest.fn()
      };

      var component = shallowRender(props);

      component.find('input[type="number"]').first().simulate('change', {
        currentTarget: {
          value: 20
        }
      });

      component.find('input[type="number"]').last().simulate('change', {
        currentTarget: {
          value: 480
        }
      });

      component.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.refine).toHaveBeenCalledWith([20, 480]);
    });

    it('expect to call refine with min, max as float', function () {
      var props = {
        refine: jest.fn()
      };

      var event = {
        preventDefault: jest.fn()
      };

      var component = shallowRender(props);

      component.find('input[type="number"]').first().simulate('change', {
        currentTarget: {
          value: 20.05
        }
      });

      component.find('input[type="number"]').last().simulate('change', {
        currentTarget: {
          value: 480.05
        }
      });

      component.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.refine).toHaveBeenCalledWith([20.05, 480.05]);
    });

    it('expect to call refine with min only', function () {
      var props = {
        refine: jest.fn()
      };

      var event = {
        preventDefault: jest.fn()
      };

      var component = shallowRender(props);

      component.find('input[type="number"]').first().simulate('change', {
        currentTarget: {
          value: 20
        }
      });

      component.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.refine).toHaveBeenCalledWith([20, undefined]);
    });

    it('expect to call refine with max only', function () {
      var props = {
        refine: jest.fn()
      };

      var event = {
        preventDefault: jest.fn()
      };

      var component = shallowRender(props);

      component.find('input[type="number"]').last().simulate('change', {
        currentTarget: {
          value: 480
        }
      });

      component.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.refine).toHaveBeenCalledWith([undefined, 480]);
    });

    it('expect to call refine without values', function () {
      var props = {
        refine: jest.fn()
      };

      var event = {
        preventDefault: jest.fn()
      };

      var component = shallowRender(props);

      component.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.refine).toHaveBeenCalledWith([undefined, undefined]);
    });
  });
});