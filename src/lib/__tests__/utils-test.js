'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils.getContainerNode', function () {
  it('should be able to get a node from a node', function () {
    var d = document.body;
    expect(utils.getContainerNode(d)).toEqual(d);
  });

  it('should be able to retrieve an element from a css selector', function () {
    var d = document.createElement('div');
    d.className = 'test';
    document.body.appendChild(d);

    expect(utils.getContainerNode('.test')).toEqual(d);
  });

  it('should throw for other types of object', function () {
    expect(utils.getContainerNode.bind(utils, undefined)).toThrow(Error);
    expect(utils.getContainerNode.bind(utils, null)).toThrow(Error);
    expect(utils.getContainerNode.bind(utils, {})).toThrow(Error);
    expect(utils.getContainerNode.bind(utils, 42)).toThrow(Error);
    expect(utils.getContainerNode.bind(utils, [])).toThrow(Error);
  });

  it('should throw when not a correct selector', function () {
    expect(utils.getContainerNode.bind(utils, '.not-in-dom')).toThrow(Error);
  });
});

describe('utils.isDomElement', function () {
  it('should return true for dom element', function () {
    expect(utils.isDomElement(document.body)).toBe(true);
  });

  it('should return false for dom element', function () {
    expect(utils.isDomElement()).toBe(false);
    expect(utils.isDomElement(undefined)).toBe(false);
    expect(utils.isDomElement(null)).toBe(false);
    expect(utils.isDomElement([])).toBe(false);
    expect(utils.isDomElement({})).toBe(false);
    expect(utils.isDomElement('')).toBe(false);
    expect(utils.isDomElement(42)).toBe(false);
  });
});

describe('utils.bemHelper', function () {
  it('should return a function', function () {
    expect(utils.bemHelper('block')).toEqual(expect.any(Function));
  });

  describe('returned function', function () {
    var returnedFunction = utils.bemHelper('block');

    it('should create a block class when invoked without parameters', function () {
      var className = returnedFunction();
      expect(className).toBe('block');
    });

    it('should create a block with element class when invoked with one parameter', function () {
      var className = returnedFunction('element');
      expect(className).toBe('block--element');
    });

    it('should create a block with element and modifier class when invoked with 2 parameters', function () {
      var className = returnedFunction('element', 'modifier');
      expect(className).toBe('block--element__modifier');
    });

    it('should create a block with a modifier class when invoked with null for element', function () {
      var className = returnedFunction(null, 'modifier');
      expect(className).toBe('block__modifier');
    });
  });
});

describe('utils.prepareTemplateProps', function () {
  var defaultTemplates = {
    foo: 'toto',
    bar: 'tata'
  };
  var templatesConfig = [];
  var transformData = function transformData() {}; // eslint-disable-line func-style

  it('should return the default templates and set useCustomCompileOptions to false when using the defaults', function () {
    var defaultsPrepared = utils.prepareTemplateProps({
      transformData: transformData,
      defaultTemplates: defaultTemplates,
      undefined: undefined,
      templatesConfig: templatesConfig
    });

    expect(defaultsPrepared.transformData).toBe(transformData);
    expect(defaultsPrepared.useCustomCompileOptions).toEqual({
      foo: false,
      bar: false
    });
    expect(defaultsPrepared.templates).toEqual(defaultTemplates);
    expect(defaultsPrepared.templatesConfig).toBe(templatesConfig);
  });

  it('should return the missing default templates and set useCustomCompileOptions for the custom template', function () {
    var templates = { foo: 'baz' };
    var defaultsPrepared = utils.prepareTemplateProps({
      transformData: transformData,
      defaultTemplates: defaultTemplates,
      templates: templates,
      templatesConfig: templatesConfig
    });

    expect(defaultsPrepared.transformData).toBe(transformData);
    expect(defaultsPrepared.useCustomCompileOptions).toEqual({
      foo: true,
      bar: false
    });
    expect(defaultsPrepared.templates).toEqual(_extends({}, defaultTemplates, templates));
    expect(defaultsPrepared.templatesConfig).toBe(templatesConfig);
  });

  it('should add also the templates that are not in the defaults', function () {
    var templates = {
      foo: 'something else',
      baz: 'Of course!'
    };

    var preparedProps = utils.prepareTemplateProps({
      transformData: transformData,
      defaultTemplates: defaultTemplates,
      templates: templates,
      templatesConfig: templatesConfig
    });

    expect(preparedProps.transformData).toBe(transformData);
    expect(preparedProps.useCustomCompileOptions).toEqual({
      foo: true,
      bar: false,
      baz: true
    });
    expect(preparedProps.templates).toEqual(_extends({}, defaultTemplates, templates));
    expect(preparedProps.templatesConfig).toBe(templatesConfig);
  });
});

describe('utils.renderTemplate', function () {
  it('expect to process templates as string', function () {
    var templateKey = 'test';
    var templates = { test: 'it works with {{type}}' };
    var data = { type: 'strings' };

    var actual = utils.renderTemplate({
      templateKey: templateKey,
      templates: templates,
      data: data
    });

    var expectation = 'it works with strings';

    expect(actual).toBe(expectation);
  });

  it('expect to process templates as function', function () {
    var templateKey = 'test';
    var templates = { test: function test(data) {
        return 'it works with ' + data.type;
      } };
    var data = { type: 'functions' };

    var actual = utils.renderTemplate({
      templateKey: templateKey,
      templates: templates,
      data: data
    });

    var expectation = 'it works with functions';

    expect(actual).toBe(expectation);
  });

  it('expect to use custom compiler options', function () {
    var templateKey = 'test';
    var templates = { test: 'it works with <%options%>' };
    var data = { options: 'custom delimiter' };
    var compileOptions = { delimiters: '<% %>' };

    var actual = utils.renderTemplate({
      templateKey: templateKey,
      templates: templates,
      data: data,
      compileOptions: compileOptions
    });

    var expectation = 'it works with custom delimiter';

    expect(actual).toBe(expectation);
  });

  it('expect to throw when the template is not a function or a string', function () {
    var actual0 = function actual0() {
      return utils.renderTemplate({
        templateKey: 'test',
        templates: {}
      });
    };

    var actual1 = function actual1() {
      return utils.renderTemplate({
        templateKey: 'test',
        templates: { test: null }
      });
    };

    var actual2 = function actual2() {
      return utils.renderTemplate({
        templateKey: 'test',
        templates: { test: 10 }
      });
    };

    var expectation0 = 'Template must be \'string\' or \'function\', was \'undefined\' (key: test)';
    var expectation1 = 'Template must be \'string\' or \'function\', was \'object\' (key: test)';
    var expectation2 = 'Template must be \'string\' or \'function\', was \'number\' (key: test)';

    expect(function () {
      return actual0();
    }).toThrow(expectation0);
    expect(function () {
      return actual1();
    }).toThrow(expectation1);
    expect(function () {
      return actual2();
    }).toThrow(expectation2);
  });

  describe('with helpers', function () {
    it('expect to call the relevant function', function () {
      var templateKey = 'test';
      var templates = {
        test: '{{#helpers.emphasis}}{{feature}}{{/helpers.emphasis}}'
      };

      var data = {
        feature: 'helpers'
      };

      var helpers = {
        emphasis: function emphasis(text, render) {
          return '<em>' + render(text) + '</em>';
        }
      };

      var actual = utils.renderTemplate({
        templateKey: templateKey,
        templates: templates,
        data: data,
        helpers: helpers
      });

      var expectation = '<em>helpers</em>';

      expect(actual).toBe(expectation);
    });

    it('expect to set the context (`this`) to the template `data`', function (done) {
      var templateKey = 'test';
      var templates = {
        test: '{{#helpers.emphasis}}{{feature}}{{/helpers.emphasis}}'
      };

      var data = {
        feature: 'helpers'
      };

      var helpers = {
        emphasis: function emphasis() {
          // context will be different when using arrow function (lexical scope used)
          expect(this).toBe(data);
          done();
        }
      };

      var actual = utils.renderTemplate({
        templateKey: templateKey,
        templates: templates,
        data: data,
        helpers: helpers
      });

      var expectation = '';

      expect(actual).toBe(expectation);
    });
  });
});

describe('utils.getRefinements', function () {
  var helper = void 0;
  var results = void 0;

  beforeEach(function () {
    helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, 'my_index', {
      facets: ['facet1', 'facet2', 'numericFacet1'],
      disjunctiveFacets: ['disjunctiveFacet1', 'disjunctiveFacet2', 'numericDisjunctiveFacet'],
      hierarchicalFacets: [{
        name: 'hierarchicalFacet1',
        attributes: ['hierarchicalFacet1.lvl0', 'hierarchicalFacet1.lvl1'],
        separator: ' > '
      }, {
        name: 'hierarchicalFacet2',
        attributes: ['hierarchicalFacet2.lvl0', 'hierarchicalFacet2.lvl1'],
        separator: ' > '
      }]
    });
    results = {};
  });

  it('should retrieve one tag', function () {
    helper.addTag('tag1');
    var expected = [{ type: 'tag', attributeName: '_tags', name: 'tag1' }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve multiple tags', function () {
    helper.addTag('tag1').addTag('tag2');
    var expected = [{ type: 'tag', attributeName: '_tags', name: 'tag1' }, { type: 'tag', attributeName: '_tags', name: 'tag2' }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve one facetRefinement', function () {
    helper.toggleRefinement('facet1', 'facet1val1');
    var expected = [{ type: 'facet', attributeName: 'facet1', name: 'facet1val1' }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve multiple facetsRefinements on one facet', function () {
    helper.toggleRefinement('facet1', 'facet1val1').toggleRefinement('facet1', 'facet1val2');
    var expected = [{ type: 'facet', attributeName: 'facet1', name: 'facet1val1' }, { type: 'facet', attributeName: 'facet1', name: 'facet1val2' }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should retrieve multiple facetsRefinements on multiple facets', function () {
    helper.toggleRefinement('facet1', 'facet1val1').toggleRefinement('facet1', 'facet1val2').toggleRefinement('facet2', 'facet2val1');
    var expected = [{ type: 'facet', attributeName: 'facet1', name: 'facet1val1' }, { type: 'facet', attributeName: 'facet1', name: 'facet1val2' }, { type: 'facet', attributeName: 'facet2', name: 'facet2val1' }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[2]);
  });

  it('should have a count for a facetRefinement if available', function () {
    helper.toggleRefinement('facet1', 'facet1val1');
    results = {
      facets: [{
        name: 'facet1',
        data: {
          facet1val1: 4
        }
      }]
    };
    var expected = [{ type: 'facet', attributeName: 'facet1', name: 'facet1val1', count: 4 }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should have exhaustive for a facetRefinement if available', function () {
    helper.toggleRefinement('facet1', 'facet1val1');
    results = {
      facets: [{
        name: 'facet1',
        exhaustive: true
      }]
    };
    var expected = [{
      type: 'facet',
      attributeName: 'facet1',
      name: 'facet1val1',
      exhaustive: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve one facetExclude', function () {
    helper.toggleExclude('facet1', 'facet1exclude1');
    var expected = [{
      type: 'exclude',
      attributeName: 'facet1',
      name: 'facet1exclude1',
      exclude: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve multiple facetsExcludes on one facet', function () {
    helper.toggleExclude('facet1', 'facet1exclude1').toggleExclude('facet1', 'facet1exclude2');
    var expected = [{
      type: 'exclude',
      attributeName: 'facet1',
      name: 'facet1exclude1',
      exclude: true
    }, {
      type: 'exclude',
      attributeName: 'facet1',
      name: 'facet1exclude2',
      exclude: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should retrieve multiple facetsExcludes on multiple facets', function () {
    helper.toggleExclude('facet1', 'facet1exclude1').toggleExclude('facet1', 'facet1exclude2').toggleExclude('facet2', 'facet2exclude1');
    var expected = [{
      type: 'exclude',
      attributeName: 'facet1',
      name: 'facet1exclude1',
      exclude: true
    }, {
      type: 'exclude',
      attributeName: 'facet1',
      name: 'facet1exclude2',
      exclude: true
    }, {
      type: 'exclude',
      attributeName: 'facet2',
      name: 'facet2exclude1',
      exclude: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[2]);
  });

  it('should retrieve one disjunctiveFacetRefinement', function () {
    helper.addDisjunctiveFacetRefinement('disjunctiveFacet1', 'disjunctiveFacet1val1');
    var expected = [{
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val1'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve multiple disjunctiveFacetsRefinements on one facet', function () {
    helper.addDisjunctiveFacetRefinement('disjunctiveFacet1', 'disjunctiveFacet1val1').addDisjunctiveFacetRefinement('disjunctiveFacet1', 'disjunctiveFacet1val2');
    var expected = [{
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val1'
    }, {
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val2'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should retrieve multiple disjunctiveFacetsRefinements on multiple facets', function () {
    helper.toggleRefinement('disjunctiveFacet1', 'disjunctiveFacet1val1').toggleRefinement('disjunctiveFacet1', 'disjunctiveFacet1val2').toggleRefinement('disjunctiveFacet2', 'disjunctiveFacet2val1');
    var expected = [{
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val1'
    }, {
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val2'
    }, {
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet2',
      name: 'disjunctiveFacet2val1'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[2]);
  });

  it('should have a count for a disjunctiveFacetRefinement if available', function () {
    helper.toggleRefinement('disjunctiveFacet1', 'disjunctiveFacet1val1');
    results = {
      disjunctiveFacets: [{
        name: 'disjunctiveFacet1',
        data: {
          disjunctiveFacet1val1: 4
        }
      }]
    };
    var expected = [{
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val1',
      count: 4
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should have exhaustive for a disjunctiveFacetRefinement if available', function () {
    helper.toggleRefinement('disjunctiveFacet1', 'disjunctiveFacet1val1');
    results = {
      disjunctiveFacets: [{
        name: 'disjunctiveFacet1',
        exhaustive: true
      }]
    };
    var expected = [{
      type: 'disjunctive',
      attributeName: 'disjunctiveFacet1',
      name: 'disjunctiveFacet1val1',
      exhaustive: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve one hierarchicalFacetRefinement', function () {
    helper.toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1lvl0val1');
    var expected = [{
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet1',
      name: 'hierarchicalFacet1lvl0val1'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve hierarchicalFacetsRefinements on multiple facets', function () {
    helper.toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1lvl0val1').toggleRefinement('hierarchicalFacet2', 'hierarchicalFacet2lvl0val1');
    var expected = [{
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet1',
      name: 'hierarchicalFacet1lvl0val1'
    }, {
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet2',
      name: 'hierarchicalFacet2lvl0val1'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should retrieve hierarchicalFacetsRefinements on multiple facets and multiple levels', function () {
    helper.toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1lvl0val1').toggleRefinement('hierarchicalFacet2', 'hierarchicalFacet2lvl0val1 > lvl1val1');
    var expected = [{
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet1',
      name: 'hierarchicalFacet1lvl0val1'
    }, {
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet2',
      name: 'lvl1val1'
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should have a count for a hierarchicalFacetRefinement if available', function () {
    helper.toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1val1');
    results = {
      hierarchicalFacets: [{
        name: 'hierarchicalFacet1',
        data: {
          hierarchicalFacet1val1: {
            name: 'hierarchicalFacet1val1',
            count: 4
          }
        }
      }]
    };
    var expected = [{
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet1',
      name: 'hierarchicalFacet1val1',
      count: 4
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should have exhaustive for a hierarchicalFacetRefinement if available', function () {
    helper.toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1val1');
    results = {
      hierarchicalFacets: [{
        name: 'hierarchicalFacet1',
        data: [{ name: 'hierarchicalFacet1val1', exhaustive: true }]
      }]
    };
    var expected = [{
      type: 'hierarchical',
      attributeName: 'hierarchicalFacet1',
      name: 'hierarchicalFacet1val1',
      exhaustive: true
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve a numericRefinement on one facet', function () {
    helper.addNumericRefinement('numericFacet1', '>', '1');
    var expected = [{
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '>',
      name: '1',
      numericValue: 1
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve a numericRefinement on one disjunctive facet', function () {
    helper.addNumericRefinement('numericDisjunctiveFacet1', '>', '1');
    var expected = [{
      type: 'numeric',
      attributeName: 'numericDisjunctiveFacet1',
      operator: '>',
      name: '1',
      numericValue: 1
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
  });

  it('should retrieve multiple numericRefinements with same operator', function () {
    helper.addNumericRefinement('numericFacet1', '>', '1').addNumericRefinement('numericFacet1', '>', '2');
    var expected = [{
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '>',
      name: '1',
      numericValue: 1
    }, {
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '>',
      name: '2',
      numericValue: 2
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
  });

  it('should retrieve multiple conjunctive and numericRefinements', function () {
    helper.addNumericRefinement('numericFacet1', '>', '1').addNumericRefinement('numericFacet1', '>', '2').addNumericRefinement('numericFacet1', '<=', '3').addNumericRefinement('numericDisjunctiveFacet1', '>', '1').addNumericRefinement('numericDisjunctiveFacet1', '>', '2');
    var expected = [{
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '>',
      name: '1',
      numericValue: 1
    }, {
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '>',
      name: '2',
      numericValue: 2
    }, {
      type: 'numeric',
      attributeName: 'numericFacet1',
      operator: '<=',
      name: '3',
      numericValue: 3
    }, {
      type: 'numeric',
      attributeName: 'numericDisjunctiveFacet1',
      operator: '>',
      name: '1',
      numericValue: 1
    }, {
      type: 'numeric',
      attributeName: 'numericDisjunctiveFacet1',
      operator: '>',
      name: '2',
      numericValue: 2
    }];
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[0]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[1]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[2]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[3]);
    expect(utils.getRefinements(results, helper.state)).toContainEqual(expected[4]);
  });
});

describe('utils.clearRefinementsFromState', function () {
  var helper = void 0;
  var state = void 0;

  beforeEach(function () {
    helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, 'my_index', {
      facets: ['facet1', 'facet2', 'numericFacet1', 'facetExclude1'],
      disjunctiveFacets: ['disjunctiveFacet1', 'numericDisjunctiveFacet'],
      hierarchicalFacets: [{
        name: 'hierarchicalFacet1',
        attributes: ['hierarchicalFacet1.lvl0', 'hierarchicalFacet1.lvl1'],
        separator: ' > '
      }]
    });
    helper.toggleRefinement('facet1', 'facet1val1').toggleRefinement('facet1', 'facet1val2').toggleRefinement('facet2', 'facet2val1').toggleRefinement('facet2', 'facet2val2').toggleRefinement('disjunctiveFacet1', 'facet1val1').toggleRefinement('disjunctiveFacet1', 'facet1val2').toggleExclude('facetExclude1', 'facetExclude1val1').toggleExclude('facetExclude1', 'facetExclude1val2').addNumericRefinement('numericFacet1', '>', '1').addNumericRefinement('numericFacet1', '>', '2').addNumericRefinement('numericDisjunctiveFacet1', '>', '1').addNumericRefinement('numericDisjunctiveFacet1', '>', '2').toggleRefinement('hierarchicalFacet1', 'hierarchicalFacet1lvl0val1').addTag('tag1').addTag('tag2');
    state = helper.state;
  });

  describe('without arguments', function () {
    it('should clear everything', function () {
      var newState = utils.clearRefinementsFromState(state);
      expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(true, "state shouldn't have facetsRefinements");
      expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(true, "state shouldn't have facetsExcludes");
      expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(true, "state shouldn't have disjunctiveFacetsRefinements");
      expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(true, "state shouldn't have hierarchicalFacetsRefinements");
      expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(true, "state shouldn't have numericRefinements");
      expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(true, "state shouldn't have tagRefinements");
    });
  });

  it('should clear one facet', function () {
    var newState = utils.clearRefinementsFromState(state, ['facet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear facets', function () {
    var newState = utils.clearRefinementsFromState(state, ['facet1', 'facet2']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(true, "state shouldn't have facetsRefinements");
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear excludes', function () {
    var newState = utils.clearRefinementsFromState(state, ['facetExclude1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(true, "state shouldn't have facetsExcludes");
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear disjunctive facets', function () {
    var newState = utils.clearRefinementsFromState(state, ['disjunctiveFacet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(true, "state shouldn't have disjunctiveFacetsRefinements");
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear hierarchical facets', function () {
    var newState = utils.clearRefinementsFromState(state, ['hierarchicalFacet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(true, "state shouldn't have hierarchicalFacetsRefinements");
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear one numeric facet', function () {
    var newState = utils.clearRefinementsFromState(state, ['numericFacet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear one numeric disjunctive facet', function () {
    var newState = utils.clearRefinementsFromState(state, ['numericDisjunctiveFacet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear numeric facets', function () {
    var newState = utils.clearRefinementsFromState(state, ['numericFacet1', 'numericDisjunctiveFacet1']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(true, "state shouldn't have numericRefinements");
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(false, 'state should have tagRefinements');
  });

  it('should clear tags', function () {
    var newState = utils.clearRefinementsFromState(state, ['_tags']);
    expect((0, _isEmpty2.default)(newState.facetsRefinements)).toBe(false, 'state should have facetsRefinements');
    expect((0, _isEmpty2.default)(newState.facetsExcludes)).toBe(false, 'state should have facetsExcludes');
    expect((0, _isEmpty2.default)(newState.disjunctiveFacetsRefinements)).toBe(false, 'state should have disjunctiveFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.hierarchicalFacetsRefinements)).toBe(false, 'state should have hierarchicalFacetsRefinements');
    expect((0, _isEmpty2.default)(newState.numericRefinements)).toBe(false, 'state should have numericRefinements');
    expect((0, _isEmpty2.default)(newState.tagRefinements)).toBe(true, "state shouldn't have tagRefinements");
  });
});

describe('utils.deprecate', function () {
  var sum = function sum() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.reduce(function (acc, _) {
      return acc + _;
    }, 0);
  };

  it('expect to call initial function and print message', function () {
    var warn = jest.spyOn(global.console, 'warn');
    var fn = utils.deprecate(sum, 'message');

    var expectation = fn(1, 2, 3);
    var actual = 6;

    expect(actual).toBe(expectation);
    expect(warn).toHaveBeenCalled();

    warn.mockReset();
    warn.mockRestore();
  });

  it('expect to call initial function twice and print message once', function () {
    var warn = jest.spyOn(global.console, 'warn');
    var fn = utils.deprecate(sum, 'message');

    var expectation0 = fn(1, 2, 3);
    var expectation1 = fn(1, 2, 3);
    var actual = 6;

    expect(actual).toBe(expectation0);
    expect(actual).toBe(expectation1);
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockReset();
    warn.mockRestore();
  });
});

describe('utils.parseAroundLatLngFromString', function () {
  it('expect to return a LatLng object from string', function () {
    var samples = [{ input: '10,12', expectation: { lat: 10, lng: 12 } }, { input: '10,    12', expectation: { lat: 10, lng: 12 } }, { input: '10.15,12', expectation: { lat: 10.15, lng: 12 } }, { input: '10,12.15', expectation: { lat: 10, lng: 12.15 } }];

    samples.forEach(function (_ref) {
      var input = _ref.input,
          expectation = _ref.expectation;

      expect(utils.parseAroundLatLngFromString(input)).toEqual(expectation);
    });
  });

  it('expect to throw an error when the parsing fail', function () {
    var samples = [{ input: '10a,12' }, { input: '10.    12' }];

    samples.forEach(function (_ref2) {
      var input = _ref2.input;

      expect(function () {
        return utils.parseAroundLatLngFromString(input);
      }).toThrow();
    });
  });
});