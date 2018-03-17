'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _PriceRangesForm = require('../PriceRangesForm');

var _PriceRangesForm2 = _interopRequireDefault(_PriceRangesForm);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('PriceRangesForm', function () {
  describe('display', function () {
    it('should pass all css classes and labels', function () {
      var props = {
        refine: function refine() {},

        labels: {
          currency: '$',
          separator: 'to',
          button: 'Go'
        },
        cssClasses: {
          form: 'form',
          label: 'label',
          input: 'input',
          currency: 'currency',
          separator: 'separator',
          button: 'button'
        },
        currentRefinement: {
          from: 10,
          to: 20
        }
      };

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_PriceRangesForm2.default, props)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('submit', function () {
    it('starts a refine on submit', function () {
      // Given
      var refine = _sinon2.default.spy();
      var handleSubmitMock = _sinon2.default.spy(_PriceRangesForm2.default.prototype, 'handleSubmit');
      var component = _testUtils2.default.renderIntoDocument(_react2.default.createElement(_PriceRangesForm2.default, {
        currentRefinement: {
          from: 10,
          to: 20
        },
        refine: refine
      }));

      // When
      component.from.value = 10;
      _testUtils2.default.Simulate.change(component.from);
      component.to.value = 20;
      _testUtils2.default.Simulate.change(component.to);
      _testUtils2.default.Simulate.submit(component.form);

      // Then
      expect(handleSubmitMock.calledOnce).toBe(true);
      expect(refine.calledWith({ from: 10, to: 20 })).toBe(true);
    });
  });
});