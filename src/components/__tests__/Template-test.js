'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Template = require('../Template');

var _Template2 = _interopRequireDefault(_Template);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('Template', function () {
  it('throws an error when templates as functions returning a React element', function () {
    var props = getProps({
      templates: {
        test: function test(templateData) {
          return _react2.default.createElement(
            'p',
            null,
            'it doesnt works with ',
            templateData.type
          );
        }
      }, // eslint-disable-line react/display-name
      data: { type: 'functions' }
    });
    expect(function () {
      return _reactTestRenderer2.default.create(_react2.default.createElement(_Template.PureTemplate, props));
    }).toThrow();
  });

  it('can configure compilation options', function () {
    var props = getProps({
      templates: { test: 'it configures compilation <%options%>' },
      data: { options: 'delimiters' },
      useCustomCompileOptions: { test: true },
      templatesConfig: { compileOptions: { delimiters: '<% %>' } }
    });
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template.PureTemplate, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('can configure custom rootTagName', function () {
    var props = getProps({ rootTagName: 'span' });
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template.PureTemplate, props)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('forward rootProps to the first node', function () {
    function fn() {}

    var props = getProps({
      rootProps: { className: 'hey', onClick: fn }
    });
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template.PureTemplate, props)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('transform data usage', function () {
    it('supports passing a transformData map function', function () {
      var props = getProps({
        templates: { test: 'it supports {{feature}}' },
        data: { feature: 'replace me' },
        transformData: function transformData(originalData) {
          originalData.feature = 'transformData';
          return originalData;
        }
      });
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('defaults data to an empty {} object', function () {
      var props = getProps({
        templates: { test: 'it supports {{feature}}' },
        transformData: function transformData(originalData) {
          originalData.test = 'transformData';
          return originalData;
        }
      });
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('transformData with a function is using a deep cloned version of the data', function () {
      var called = false;
      var data = { a: {} };
      var props = getProps({
        templates: { test: '' },
        data: data,
        transformData: function transformData(clonedData) {
          called = true;
          expect(clonedData).not.toBe(data);
          expect(clonedData.a).not.toBe(data.a);
          expect(clonedData).toEqual(data);
          return clonedData;
        }
      });

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props)).toJSON();
      expect(tree).toMatchSnapshot();
      expect(called).toBe(true);
    });

    it('transformData with an object is using a deep cloned version of the data', function () {
      var called = false;
      var data = { a: {} };
      var props = getProps({
        templates: { test: '' },
        data: data,
        transformData: {
          test: function test(clonedData) {
            called = true;
            expect(clonedData).not.toBe(data);
            expect(clonedData.a).not.toBe(data.a);
            expect(clonedData).toEqual(data);
            return clonedData;
          }
        }
      });

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props)).toJSON();
      expect(tree).toMatchSnapshot();
      expect(called).toBe(true);
    });

    it('throws an error if the transformData is not returning anything', function () {
      var props = getProps({
        templates: { test: 'it supports {{feature}}' },
        data: { feature: 'replace me' },
        transformData: function transformData() {
          /* missing return value */
        }
      });

      expect(function () {
        _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props));
      }).toThrow('`transformData` must return a `object`, got `undefined`.');
    });

    it('does not throw an error if the transformData is an object without the templateKey', function () {
      var props = getProps({
        templates: { test: 'it supports {{feature}}' },
        data: { feature: 'replace me' },
        transformData: {
          anotherKey: function anotherKey(d) {
            return d;
          }
        }
      });

      expect(function () {
        _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props));
      }).not.toThrow();
    });

    it('throws an error if the transformData returns an unexpected type', function () {
      var props = getProps({
        templates: { test: 'it supports {{feature}}' },
        data: { feature: 'replace me' },
        transformData: function transformData() {
          return true;
        }
      });

      expect(function () {
        _reactTestRenderer2.default.create(_react2.default.createElement(_Template2.default, props));
      }).toThrow('`transformData` must return a `object`, got `boolean`.');
    });
  });

  describe('shouldComponentUpdate', function () {
    var props = void 0;
    var component = void 0;
    var container = void 0;

    beforeEach(function () {
      container = document.createElement('div');
      props = getProps({
        data: { hello: 'mom' },
        rootProps: { className: 'myCssClass' }
      });
      component = _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      _sinon2.default.spy(component, 'render');
    });

    it('does not call render when no change in data', function () {
      _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      expect(component.render.called).toBe(false);
    });

    it('calls render when data changes', function () {
      props.data = { hello: 'dad' };
      _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      expect(component.render.called).toBe(true);
    });

    it('calls render when templateKey changes', function () {
      props.templateKey += '-rerender';
      props.templates = _defineProperty({}, props.templateKey, '');
      _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      expect(component.render.called).toBe(true);
    });

    it('calls render when rootProps changes', function () {
      props.rootProps = { className: 'myCssClass mySecondCssClass' };
      _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      expect(component.render.called).toBe(true);
    });

    it('does not call render when rootProps remain unchanged', function () {
      props.rootProps = { className: 'myCssClass' };
      _reactDom2.default.render(_react2.default.createElement(_Template.PureTemplate, props), container);
      expect(component.render.called).toBe(false);
    });
  });

  function getProps(_ref) {
    var _ref$templates = _ref.templates,
        templates = _ref$templates === undefined ? { test: '' } : _ref$templates,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$templateKey = _ref.templateKey,
        templateKey = _ref$templateKey === undefined ? 'test' : _ref$templateKey,
        _ref$rootProps = _ref.rootProps,
        rootProps = _ref$rootProps === undefined ? {} : _ref$rootProps,
        _ref$useCustomCompile = _ref.useCustomCompileOptions,
        useCustomCompileOptions = _ref$useCustomCompile === undefined ? {} : _ref$useCustomCompile,
        _ref$templatesConfig = _ref.templatesConfig,
        templatesConfig = _ref$templatesConfig === undefined ? { helper: {}, compileOptions: {} } : _ref$templatesConfig,
        _ref$transformData = _ref.transformData,
        transformData = _ref$transformData === undefined ? null : _ref$transformData,
        props = _objectWithoutProperties(_ref, ['templates', 'data', 'templateKey', 'rootProps', 'useCustomCompileOptions', 'templatesConfig', 'transformData']);

    return _extends({}, props, {
      templates: templates,
      data: data,
      templateKey: templateKey,
      rootProps: rootProps,
      useCustomCompileOptions: useCustomCompileOptions,
      templatesConfig: templatesConfig,
      transformData: transformData
    });
  }
});