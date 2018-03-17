'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _enzyme = require('enzyme');

var _shallow = require('react-test-renderer/shallow');

var _headerFooter = require('../headerFooter');

var _headerFooter2 = _interopRequireDefault(_headerFooter);

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
      return _react2.default.createElement('div', this.props);
    }
  }]);

  return TestComponent;
}(_react.Component);

describe('headerFooter', function () {
  var renderer = void 0;
  var defaultProps = void 0;

  function render() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var HeaderFooter = (0, _headerFooter2.default)(TestComponent);
    renderer.render(_react2.default.createElement(HeaderFooter, props));
    return renderer.getRenderOutput();
  }

  function shallowRender() {
    var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var props = _extends({
      templateProps: {}
    }, extraProps);
    var componentWrappedInHeaderFooter = (0, _headerFooter2.default)(TestComponent);
    return (0, _enzyme.shallow)(_react2.default.createElement(componentWrappedInHeaderFooter, props));
  }

  beforeEach(function () {
    defaultProps = {
      cssClasses: {
        root: 'root',
        body: 'body'
      },
      collapsible: false,
      templateProps: {}
    };
    renderer = (0, _shallow.createRenderer)();
  });

  it('should render the component in a root and body', function () {
    var out = render(defaultProps);
    (0, _expect2.default)(out).toMatchSnapshot();
  });

  it('should add a header if such a template is passed', function () {
    // Given
    defaultProps.templateProps.templates = {
      header: 'HEADER'
    };
    // When
    var out = render(defaultProps);
    // Then
    (0, _expect2.default)(out).toMatchSnapshot();
  });

  it('should add a footer if such a template is passed', function () {
    // Given
    defaultProps.templateProps.templates = {
      footer: 'FOOTER'
    };
    // When
    var out = render(defaultProps);
    // Then
    (0, _expect2.default)(out).toMatchSnapshot();
  });

  describe('collapsible', function () {
    beforeEach(function () {
      defaultProps.templateProps.templates = {
        header: 'yo header',
        footer: 'yo footer'
      };
    });

    it('when true', function () {
      defaultProps.collapsible = true;
      var out = render(defaultProps);
      (0, _expect2.default)(out).toMatchSnapshot();
    });

    it('when collapsed', function () {
      defaultProps.collapsible = { collapsed: true };
      var out = render(defaultProps);
      (0, _expect2.default)(out).toMatchSnapshot();
    });
  });

  describe('headerFooterData', function () {
    it('should call the header and footer template with the given data', function () {
      // Given
      var props = {
        headerFooterData: {
          header: {
            foo: 'bar'
          },
          footer: {
            foo: 'baz'
          }
        },
        templateProps: {
          templates: {
            header: 'header',
            footer: 'footer'
          }
        }
      };

      // When
      var actual = shallowRender(props);
      var header = actual.find({ templateKey: 'header' });
      var footer = actual.find({ templateKey: 'footer' });

      // Then
      (0, _expect2.default)(header.props().data.foo).toEqual('bar');
      (0, _expect2.default)(footer.props().data.foo).toEqual('baz');
    });
  });
});