'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _enzyme = require('enzyme');

var _autoHideContainer = require('../autoHideContainer');

var _autoHideContainer2 = _interopRequireDefault(_autoHideContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestComponent = function (_Component) {
  _inherits(TestComponent, _Component);

  function TestComponent() {
    _classCallCheck(this, TestComponent);

    return _possibleConstructorReturn(this, (TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).apply(this, arguments));
  }

  _createClass(TestComponent, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.props.hello
      );
    }
  }]);

  return TestComponent;
}(_react.Component);

TestComponent.propTypes = {
  hello: _propTypes2.default.string
};

describe('autoHideContainer', function () {
  var props = {};

  it('should render autoHideContainer(<TestComponent />)', function () {
    props.hello = 'son';
    var AutoHide = (0, _autoHideContainer2.default)(TestComponent);
    var out = (0, _enzyme.shallow)(_react2.default.createElement(AutoHide, _extends({ shouldAutoHideContainer: true }, props)));
    expect(out).toMatchSnapshot();
  });

  describe('props.shouldAutoHideContainer', function () {
    var AutoHide = void 0;
    var component = void 0;
    var container = void 0;
    var innerContainer = void 0;

    beforeEach(function () {
      AutoHide = (0, _autoHideContainer2.default)(TestComponent);
      container = document.createElement('div');
      props = { hello: 'mom', shouldAutoHideContainer: false };
      component = _reactDom2.default.render(_react2.default.createElement(AutoHide, props), container);
    });

    it('creates a component', function () {
      expect(component).toBeDefined();
    });

    it('shows the container at first', function () {
      expect(container.style.display).not.toEqual('none');
    });

    describe('when set to true', function () {
      beforeEach(function () {
        jest.spyOn(component, 'render');
        props.shouldAutoHideContainer = true;
        _reactDom2.default.render(_react2.default.createElement(AutoHide, props), container);
        innerContainer = container.firstElementChild;
      });

      it('hides the container', function () {
        expect(innerContainer.style.display).toEqual('none');
      });

      it('call component.render()', function () {
        expect(component.render).toHaveBeenCalled();
      });

      describe('when set back to false', function () {
        beforeEach(function () {
          props.shouldAutoHideContainer = false;
          _reactDom2.default.render(_react2.default.createElement(AutoHide, props), container);
        });

        it('shows the container', function () {
          expect(innerContainer.style.display).not.toEqual('none');
        });

        it('calls component.render()', function () {
          expect(component.render).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
});