'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _enzyme = require('enzyme');

var _GeoSearchControls = require('../GeoSearchControls');

var _GeoSearchControls2 = _interopRequireDefault(_GeoSearchControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GeoSearchControls', function () {
  var CSSClassesDefaultProps = {
    control: 'control',
    toggleLabel: 'toggleLabel',
    toggleLabelActive: 'toggleLabelActive',
    toggleInput: 'toggleInput',
    redo: 'redo',
    clear: 'clear'
  };

  var defaultProps = {
    cssClasses: CSSClassesDefaultProps,
    enableRefineControl: true,
    enableClearMapRefinement: true,
    isRefineOnMapMove: true,
    isRefinedWithMap: false,
    hasMapMoveSinceLastRefine: false,
    onRefineToggle: function onRefineToggle() {},
    onRefineClick: function onRefineClick() {},
    onClearClick: function onClearClick() {},
    templateProps: {}
  };

  describe('Control enabled', function () {
    it('expect to render the toggle checked when refine on map move is enabled', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: true,
        hasMapMoveSinceLastRefine: false
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render the toggle checked when refine on map move is enabled even when the map has moved', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: true,
        hasMapMoveSinceLastRefine: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render the toggle unchecked when refine on map move is disabled and the map has not moved', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: false
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render the button when refine on map move is disabled and the map has moved', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to call onRefineToggle when the toggle is toggled', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: true,
        hasMapMoveSinceLastRefine: false,
        onRefineToggle: jest.fn()
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(props.onRefineToggle).not.toHaveBeenCalled();

      wrapper.find('GeoSearchToggle').simulate('toggle');

      expect(props.onRefineToggle).toHaveBeenCalled();
    });

    it('expect to call onRefineClick when the button is clicked', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: true,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: true,
        onRefineClick: jest.fn()
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(props.onRefineClick).not.toHaveBeenCalled();

      wrapper.find('GeoSearchButton').simulate('click');

      expect(props.onRefineClick).toHaveBeenCalled();
    });
  });

  describe('Control disabled', function () {
    it('expect to render the button enabled when refine on map move is disabled and the map as moved', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render the button disabled when refine on map move is disabled and the map has not moved', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: false
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render nothing when refine on map move is enabled', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        isRefineOnMapMove: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to call onRefineClick whe the button is clicked', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: true,
        onRefineClick: jest.fn()
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(props.onRefineClick).not.toHaveBeenCalled();

      wrapper.find('GeoSearchButton').simulate('click');

      expect(props.onRefineClick).toHaveBeenCalled();
    });
  });

  describe('Clear button', function () {
    it('expect to render the button when the refinement come from the map', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        enableClearMapRefinement: true,
        isRefinedWithMap: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to not render the button when the refinement is not coming from the map', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        enableClearMapRefinement: true,
        isRefinedWithMap: false
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to not render the button when the options is disabled', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        enableClearMapRefinement: false,
        isRefinedWithMap: true
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(wrapper).toMatchSnapshot();
    });

    it('expect to call onClearClick when the clear button is clicked', function () {
      var props = _extends({}, defaultProps, {
        enableRefineControl: false,
        enableClearMapRefinement: true,
        isRefinedWithMap: true,
        onClearClick: jest.fn()
      });

      var wrapper = (0, _enzyme.shallow)(_preactCompat2.default.createElement(_GeoSearchControls2.default, props));

      expect(props.onClearClick).not.toHaveBeenCalled();

      wrapper.find('.clear').simulate('click');

      expect(props.onClearClick).toHaveBeenCalled();
    });
  });
});