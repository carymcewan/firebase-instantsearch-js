'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint react/no-multi-comp: 0 */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CurrentRefinedValues = require('../CurrentRefinedValues.js');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CurrentRefinedValues', function () {
  var defaultTemplates = void 0;

  var cssClasses = void 0;
  var templateProps = void 0;
  var refinements = void 0;
  var clearRefinementURLs = void 0;

  var parameters = void 0;

  beforeEach(function () {
    defaultTemplates = {
      header: 'DEFAULT HEADER TEMPLATE',
      clearAll: 'DEFAULT CLEAR ALL TEMPLATE',
      item: 'DEFAULT ITEM TEMPLATE',
      footer: 'DEFAULT FOOTER TEMPLATE'
    };

    templateProps = {
      templates: {
        clearAll: 'CLEAR ALL',
        item: '{{attributeName}}: {{name}} :{{label}}'
      },
      defaultTemplates: defaultTemplates
    };

    cssClasses = {
      clearAll: 'clear-all-class',
      list: 'list-class',
      item: 'item-class',
      link: 'link-class',
      count: 'count-class'
    };

    refinements = [{
      type: 'facet',
      attributeName: 'facet',
      name: 'facet-val1',
      count: 1,
      exhaustive: true
    }, {
      type: 'facet',
      attributeName: 'facet',
      name: 'facet-val2',
      count: 2,
      exhaustive: true
    }, {
      type: 'exclude',
      attributeName: 'facetExclude',
      name: 'disjunctiveFacet-val1',
      exclude: true
    }, {
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet',
      name: 'disjunctiveFacet-val1'
    }, {
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet',
      name: 'hierarchicalFacet-val1'
    }, {
      type: 'numeric',
      attributeName: 'numericFacet',
      name: 'numericFacet-val1',
      operator: '>='
    }, { type: 'tag', attributeName: '_tags', name: 'tag1' }];

    clearRefinementURLs = ['#cleared-facet-val1', '#cleared-facet-val2', '#cleared-facetExclude-val1', '#cleared-disjunctiveFacet-val1', '#cleared-hierarchicalFacet-val1', '#cleared-numericFacet-val1', '#cleared-tag1'];

    parameters = {
      attributes: {
        facet: { name: 'facet' },
        facetExclude: { name: 'facetExclude' },
        disjunctiveFacet: { name: 'disjunctiveFacet' },
        hierarchicalFacet: { name: 'hierarchicalFacet' },
        numericFacet: { name: 'numericFacet' },
        _tags: { name: '_tags' }
      },
      clearAllClick: function clearAllClick() {},
      clearAllPosition: 'before',
      clearAllURL: '#cleared-all',
      clearRefinementClicks: [function () {}, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}],
      clearRefinementURLs: clearRefinementURLs,
      cssClasses: cssClasses,
      refinements: refinements,
      templateProps: templateProps
    };
  });

  it('renders', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('options.attributes', function () {
    it('uses label', function () {
      parameters.attributes.facet = { name: 'facet', label: 'COUCOU' };

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('uses template', function () {
      parameters.attributes.facet = {
        name: 'facet',
        template: 'CUSTOM TEMPLATE'
      };

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('uses transformData', function () {
      var transformData = function transformData(data) {
        return _extends({ label: 'YEAH!' }, data);
      };
      parameters.attributes.facet = { name: 'facet', transformData: transformData };

      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('options.clearAllPosition', function () {
    it("'before'", function () {
      parameters.clearAllPosition = 'before';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("'after'", function () {
      parameters.clearAllPosition = 'after';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('false', function () {
      parameters.clearAllPosition = false;
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('options.clearAllURL', function () {
    it('is used in the clearAll element before', function () {
      parameters.clearAllURL = '#custom-clear-all';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('is used in the clearAll element after', function () {
      parameters.clearAllURL = '#custom-clear-all';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('options.clearRefinementURLs', function () {
    it('is used in an item element', function () {
      parameters.clearRefinementURLs[1] = '#custom-clear-specific';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('options.refinements', function () {
    beforeEach(function () {
      parameters.attributes = {};
      parameters.clearRefinementURLs = ['#cleared-custom'];
      parameters.clearRefinementClicks = [function () {}];
      clearRefinementURLs = ['#cleared-custom'];
    });

    it('can be used with a facet', function () {
      parameters.refinements = [{ type: 'facet', attributeName: 'customFacet', name: 'val1' }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can be used with an exclude', function () {
      parameters.refinements = [{
        type: 'exclude',
        attributeName: 'customExcludeFacet',
        name: 'val1',
        exclude: true
      }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can be used with a disjunctive facet', function () {
      parameters.refinements = [{
        type: 'disjunctive',
        attributeName: 'customDisjunctiveFacet',
        name: 'val1'
      }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can be used with a hierarchical facet', function () {
      parameters.refinements = [{
        type: 'hierarchical',
        attributeName: 'customHierarchicalFacet',
        name: 'val1'
      }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can be used with numeric filters', function () {
      parameters.refinements = [{
        type: 'numeric',
        attributeName: 'customNumericFilter',
        operator: '=',
        name: 'val1'
      }, {
        type: 'numeric',
        attributeName: 'customNumericFilter',
        operator: '<=',
        name: 'val2'
      }, {
        type: 'numeric',
        attributeName: 'customNumericFilter',
        operator: '>=',
        name: 'val3'
      }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can be used with a tag', function () {
      parameters.refinements = [{ type: 'tag', attributeName: '_tags', name: 'tag1' }];
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('options.templateProps', function () {
    it('passes a custom template if given', function () {
      parameters.templateProps.templates.item = 'CUSTOM ITEM TEMPLATE';
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_CurrentRefinedValues.RawCurrentRefinedValues, parameters)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});