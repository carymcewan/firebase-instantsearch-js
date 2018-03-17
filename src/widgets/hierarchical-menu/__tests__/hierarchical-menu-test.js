'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _hierarchicalMenu = require('../hierarchical-menu');

var _hierarchicalMenu2 = _interopRequireDefault(_hierarchicalMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('hierarchicalMenu()', function () {
  var container = void 0;
  var attributes = void 0;
  var options = void 0;
  var widget = void 0;
  var ReactDOM = void 0;

  beforeEach(function () {
    container = document.createElement('div');
    attributes = ['hello', 'world'];
    options = {};
    ReactDOM = { render: _sinon2.default.spy() };
    _hierarchicalMenu2.default.__Rewire__('render', ReactDOM.render);
  });

  describe('instantiated with wrong parameters', function () {
    it('should fail if no attributes', function () {
      options = { container: container, attributes: undefined };
      expect(function () {
        return (0, _hierarchicalMenu2.default)(options);
      }).toThrow(/^Usage:/);
    });

    it('should fail if attributes empty', function () {
      options = { container: container, attributes: [] };
      expect(function () {
        return (0, _hierarchicalMenu2.default)(options);
      }).toThrow(/^Usage:/);
    });

    it('should fail if no container', function () {
      options = { container: undefined, attributes: attributes };
      expect(function () {
        return (0, _hierarchicalMenu2.default)(options);
      }).toThrow(/^Usage:/);
    });
  });

  describe('getConfiguration', function () {
    beforeEach(function () {
      options = { container: container, attributes: attributes };
    });

    it('has defaults', function () {
      expect((0, _hierarchicalMenu2.default)(options).getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'hello',
          rootPath: null,
          attributes: ['hello', 'world'],
          separator: ' > ',
          showParentLevel: true
        }],
        maxValuesPerFacet: 10
      });
    });

    it('understand the separator option', function () {
      expect((0, _hierarchicalMenu2.default)(_extends({ separator: ' ? ' }, options)).getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'hello',
          rootPath: null,
          attributes: ['hello', 'world'],
          separator: ' ? ',
          showParentLevel: true
        }],
        maxValuesPerFacet: 10
      });
    });

    it('understand the showParentLevel option', function () {
      expect((0, _hierarchicalMenu2.default)(_extends({
        showParentLevel: false
      }, options)).getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'hello',
          rootPath: null,
          attributes: ['hello', 'world'],
          separator: ' > ',
          showParentLevel: false
        }],
        maxValuesPerFacet: 10
      });
    });

    it('understand the rootPath option', function () {
      expect((0, _hierarchicalMenu2.default)(_extends({ rootPath: 'Beer' }, options)).getConfiguration({})).toEqual({
        hierarchicalFacets: [{
          name: 'hello',
          rootPath: 'Beer',
          attributes: ['hello', 'world'],
          separator: ' > ',
          showParentLevel: true
        }],
        maxValuesPerFacet: 10
      });
    });

    describe('limit option', function () {
      it('configures maxValuesPerFacet', function () {
        return expect((0, _hierarchicalMenu2.default)(_extends({ limit: 20 }, options)).getConfiguration({}).maxValuesPerFacet).toBe(20);
      });

      it('uses provided maxValuesPerFacet when higher', function () {
        return expect((0, _hierarchicalMenu2.default)(_extends({ limit: 20 }, options)).getConfiguration({
          maxValuesPerFacet: 30
        }).maxValuesPerFacet).toBe(30);
      });

      it('ignores provided maxValuesPerFacet when lower', function () {
        return expect((0, _hierarchicalMenu2.default)(_extends({ limit: 10 }, options)).getConfiguration({
          maxValuesPerFacet: 3
        }).maxValuesPerFacet).toBe(10);
      });
    });
  });

  describe('render', function () {
    var results = void 0;
    var data = void 0;
    var helper = void 0;
    var state = void 0;
    var createURL = void 0;

    beforeEach(function () {
      data = { data: [{ name: 'foo' }, { name: 'bar' }] };
      results = { getFacetValues: _sinon2.default.spy(function () {
          return data;
        }) };
      helper = {
        toggleRefinement: _sinon2.default.stub().returnsThis(),
        search: _sinon2.default.spy()
      };
      state = {
        toggleRefinement: _sinon2.default.spy()
      };
      options = { container: container, attributes: attributes };
      createURL = function createURL() {
        return '#';
      };
    });

    it('understand provided cssClasses', function () {
      var userCssClasses = {
        root: ['root', 'cx'],
        header: 'header',
        body: 'body',
        footer: 'footer',
        list: 'list',
        item: 'item',
        active: 'active',
        link: 'link',
        count: 'count'
      };

      widget = (0, _hierarchicalMenu2.default)(_extends({}, options, { cssClasses: userCssClasses }));
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    });

    it('calls ReactDOM.render', function () {
      widget = (0, _hierarchicalMenu2.default)(options);
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(ReactDOM.render.calledOnce).toBe(true);
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    });

    it('asks for results.getFacetValues', function () {
      widget = (0, _hierarchicalMenu2.default)(options);
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(results.getFacetValues.calledOnce).toBe(true);
      expect(results.getFacetValues.getCall(0).args).toEqual(['hello', {
        sortBy: ['name:asc']
      }]);
    });

    it('has a sortBy option', function () {
      widget = (0, _hierarchicalMenu2.default)(_extends({}, options, { sortBy: ['count:asc'] }));
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(results.getFacetValues.calledOnce).toBe(true);
      expect(results.getFacetValues.getCall(0).args).toEqual(['hello', {
        sortBy: ['count:asc']
      }]);
    });

    it('has a templates option', function () {
      widget = (0, _hierarchicalMenu2.default)(_extends({}, options, {
        templates: {
          header: 'header2',
          item: 'item2',
          footer: 'footer2'
        }
      }));
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    });

    it('sets shouldAutoHideContainer to true when no results', function () {
      data = {};
      widget = (0, _hierarchicalMenu2.default)(options);
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    });

    it('sets facetValues to empty array when no results', function () {
      data = {};
      widget = (0, _hierarchicalMenu2.default)(options);
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
    });

    it('has a toggleRefinement method', function () {
      widget = (0, _hierarchicalMenu2.default)(options);
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      var elementToggleRefinement = ReactDOM.render.firstCall.args[0].props.toggleRefinement;
      elementToggleRefinement('mom');
      expect(helper.toggleRefinement.calledOnce).toBe(true);
      expect(helper.toggleRefinement.getCall(0).args).toEqual(['hello', 'mom']);
      expect(helper.search.calledOnce).toBe(true);
      expect(helper.toggleRefinement.calledBefore(helper.search)).toBe(true);
    });

    it('has a limit option', function () {
      var secondLevel = [{ name: 'six', path: 'six' }, { name: 'seven', path: 'seven' }, { name: 'eight', path: 'eight' }, { name: 'nine', path: 'nine' }];

      var firstLevel = [{ name: 'one', path: 'one' }, { name: 'two', path: 'two', data: secondLevel }, { name: 'three', path: 'three' }, { name: 'four', path: 'four' }, { name: 'five', path: 'five' }];

      data = { data: firstLevel };
      var expectedFacetValues = [{ label: 'one', value: 'one' }, {
        label: 'two',
        value: 'two',
        data: [{ label: 'six', value: 'six' }, { label: 'seven', value: 'seven' }, { label: 'eight', value: 'eight' }]
      }, { label: 'three', value: 'three' }];
      widget = (0, _hierarchicalMenu2.default)(_extends({}, options, { limit: 3 }));
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: {} });
      widget.render({ results: results, state: state });
      var actualFacetValues = ReactDOM.render.firstCall.args[0].props.facetValues;
      expect(actualFacetValues).toEqual(expectedFacetValues);
    });

    afterEach(function () {
      _hierarchicalMenu2.default.__ResetDependency__('defaultTemplates');
    });
  });

  afterEach(function () {
    _hierarchicalMenu2.default.__ResetDependency__('render');
    _hierarchicalMenu2.default.__ResetDependency__('autoHideContainerHOC');
    _hierarchicalMenu2.default.__ResetDependency__('headerFooterHOC');
  });
});