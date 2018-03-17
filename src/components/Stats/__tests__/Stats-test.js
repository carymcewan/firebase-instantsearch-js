'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _Stats = require('../Stats');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Stats', function () {
  it('should render <Template data= />', function () {
    var out = (0, _enzyme.shallow)(_react2.default.createElement(_Stats.RawStats, _extends({}, getProps(), { templateProps: {} })));

    var defaultProps = {
      cssClasses: {},
      hasManyResults: true,
      hasNoResults: false,
      hasOneResult: false
    };
    expect(out.props().data).toMatchObject(defaultProps);
    expect(out).toMatchSnapshot();
  });

  function getProps() {
    var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return _extends({
      cssClasses: {},
      hitsPerPage: 10,
      nbHits: 1234,
      nbPages: 124,
      page: 0,
      processingTimeMS: 42,
      query: 'a query'
    }, extraProps);
  }
});