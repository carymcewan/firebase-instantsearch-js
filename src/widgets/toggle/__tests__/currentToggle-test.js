'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _toggle = require('../toggle.js');

var _toggle2 = _interopRequireDefault(_toggle);

var _defaultTemplates = require('../defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _RefinementList = require('../../../components/RefinementList/RefinementList.js');

var _RefinementList2 = _interopRequireDefault(_RefinementList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('currentToggle()', function () {
  describe('good usage', function () {
    var ReactDOM = void 0;
    var containerNode = void 0;
    var widget = void 0;
    var attributeName = void 0;
    var label = void 0;
    var userValues = void 0;
    var collapsible = void 0;
    var cssClasses = void 0;
    var instantSearchInstance = void 0;

    beforeEach(function () {
      ReactDOM = { render: _sinon2.default.spy() };

      _toggle2.default.__Rewire__('render', ReactDOM.render);

      containerNode = document.createElement('div');
      label = 'Hello, ';
      attributeName = 'world!';
      cssClasses = {
        active: 'ais-toggle--item__active',
        body: 'ais-toggle--body',
        checkbox: 'ais-toggle--checkbox',
        count: 'ais-toggle--count',
        footer: 'ais-toggle--footer',
        header: 'ais-toggle--header',
        item: 'ais-toggle--item',
        label: 'ais-toggle--label',
        list: 'ais-toggle--list',
        root: 'ais-toggle'
      };
      collapsible = false;
      userValues = { on: true, off: undefined };
      widget = (0, _toggle2.default)({
        container: containerNode,
        attributeName: attributeName,
        label: label
      });
      instantSearchInstance = { templatesConfig: undefined };
    });

    it('configures disjunctiveFacets', function () {
      (0, _expect2.default)(widget.getConfiguration()).toEqual({
        disjunctiveFacets: ['world!']
      });
    });

    describe('render', function () {
      var templateProps = void 0;
      var results = void 0;
      var helper = void 0;
      var state = void 0;
      var props = void 0;
      var createURL = void 0;

      beforeEach(function () {
        templateProps = {
          templatesConfig: undefined,
          templates: _defaultTemplates2.default,
          useCustomCompileOptions: {
            header: false,
            item: false,
            footer: false
          },
          transformData: undefined
        };
        helper = {
          state: {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(false)
          },
          removeDisjunctiveFacetRefinement: _sinon2.default.spy(),
          addDisjunctiveFacetRefinement: _sinon2.default.spy(),
          search: _sinon2.default.spy()
        };
        state = {
          removeDisjunctiveFacetRefinement: _sinon2.default.spy(),
          addDisjunctiveFacetRefinement: _sinon2.default.spy(),
          isDisjunctiveFacetRefined: _sinon2.default.stub().returns(false)
        };
        props = {
          cssClasses: cssClasses,
          collapsible: false,
          templateProps: templateProps,
          createURL: function createURL() {},
          toggleRefinement: function toggleRefinement() {}
        };
        createURL = function createURL() {
          return '#';
        };
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
      });

      it('calls twice ReactDOM.render', function () {
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: 'true', count: 2 }, { name: 'false', count: 1 }])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          userValues: userValues
        });
        widget.getConfiguration();
        widget.init({ helper: helper, state: state, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        widget.render({ results: results, helper: helper, state: state });
        (0, _expect2.default)(ReactDOM.render.calledTwice).toBe(true, 'ReactDOM.render called twice');
        (0, _expect2.default)(ReactDOM.render.firstCall.args[1]).toEqual(containerNode);
        (0, _expect2.default)(ReactDOM.render.secondCall.args[1]).toEqual(containerNode);
      });

      it('understands cssClasses', function () {
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: 'true', count: 2, isRefined: false }, { name: 'false', count: 1, isRefined: false }])
        };
        props.cssClasses.root = 'ais-toggle test';
        props = _extends({
          facetValues: [{
            count: 2,
            isRefined: false,
            name: label,
            offFacetValue: { count: 3, name: 'Hello, ', isRefined: false },
            onFacetValue: { count: 2, name: 'Hello, ', isRefined: false }
          }],
          shouldAutoHideContainer: false
        }, props);
        cssClasses = props.cssClasses;
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          cssClasses: { root: 'test' },
          userValues: userValues,
          RefinementList: _RefinementList2.default,
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });

      it('with facet values', function () {
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: 'true', count: 2, isRefined: false }, { name: 'false', count: 1, isRefined: false }])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          userValues: userValues,
          RefinementList: _RefinementList2.default,
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        widget.render({ results: results, helper: helper, state: state });

        props = _extends({
          facetValues: [{
            count: 2,
            isRefined: false,
            name: label,
            offFacetValue: { count: 3, name: 'Hello, ', isRefined: false },
            onFacetValue: { count: 2, name: 'Hello, ', isRefined: false }
          }],
          shouldAutoHideContainer: false
        }, props);

        (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      });

      it('supports negative numeric off or on values', function () {
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: '-2', count: 2, isRefined: true }, { name: '5', count: 1, isRefined: false }])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          values: {
            off: -2,
            on: 5
          },
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        widget.render({ results: results, helper: helper, state: state });

        props = _extends({
          facetValues: [{
            count: 1,
            isRefined: false,
            name: label,
            offFacetValue: { count: 2, name: label, isRefined: true },
            onFacetValue: { count: 1, name: label, isRefined: false }
          }],
          shouldAutoHideContainer: false
        }, props);

        // The first call is not the one expected, because of the new init rendering..
        (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();

        widget.toggleRefinement({ isRefined: true });
        (0, _expect2.default)(helper.removeDisjunctiveFacetRefinement.calledWith(attributeName, 5)).toBe(true);
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWith(attributeName, '\\-2')).toBe(true);
      });

      it('without facet values', function () {
        results = {
          hits: [],
          nbHits: 0,
          getFacetValues: _sinon2.default.stub().returns([])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          userValues: userValues,
          RefinementList: _RefinementList2.default,
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        widget.render({ results: results, helper: helper, state: state });

        props = _extends({
          facetValues: [{
            name: label,
            isRefined: false,
            count: null,
            onFacetValue: { name: label, isRefined: false, count: null },
            offFacetValue: { name: label, isRefined: false, count: 0 }
          }],
          shouldAutoHideContainer: true
        }, props);

        (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      });

      it('when refined', function () {
        helper = {
          state: {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(true)
          }
        };
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: 'true', count: 2, isRefined: true }, { name: 'false', count: 1, isRefined: false }])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          userValues: userValues,
          RefinementList: _RefinementList2.default,
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        widget.render({ results: results, helper: helper, state: state });

        props = _extends({
          facetValues: [{
            count: 3,
            isRefined: true,
            name: label,
            onFacetValue: { name: label, isRefined: true, count: 2 },
            offFacetValue: { name: label, isRefined: false, count: 3 }
          }],
          shouldAutoHideContainer: false
        }, props);

        (0, _expect2.default)(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        (0, _expect2.default)(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      });

      it('using props.refine', function () {
        results = {
          hits: [{ Hello: ', world!' }],
          nbHits: 1,
          getFacetValues: _sinon2.default.stub().returns([{ name: 'true', count: 2 }, { name: 'false', count: 1 }])
        };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          cssClasses: cssClasses,
          userValues: userValues,
          RefinementList: _RefinementList2.default,
          collapsible: collapsible
        });
        widget.getConfiguration();
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper, state: state });
        var toggleRefinement = ReactDOM.render.firstCall.args[0].props.toggleRefinement;

        (0, _expect2.default)(typeof toggleRefinement === 'undefined' ? 'undefined' : _typeof(toggleRefinement)).toEqual('function');
        toggleRefinement();
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledOnce).toBe(true);
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWithExactly(attributeName, true)).toBe(true);
        helper.hasRefinements = _sinon2.default.stub().returns(true);
      });
    });

    describe('refine', function () {
      var helper = void 0;

      function toggleOn() {
        widget.toggleRefinement({ isRefined: false });
      }
      function toggleOff() {
        widget.toggleRefinement({ isRefined: true });
      }

      beforeEach(function () {
        helper = {
          removeDisjunctiveFacetRefinement: _sinon2.default.spy(),
          addDisjunctiveFacetRefinement: _sinon2.default.spy(),
          search: _sinon2.default.spy()
        };
      });

      describe('default values', function () {
        it('toggle on should add filter to true', function () {
          // Given
          widget = (0, _toggle2.default)({
            container: containerNode,
            attributeName: attributeName,
            label: label,
            userValues: userValues
          });
          widget.getConfiguration();
          var state = {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(false)
          };
          var createURL = function createURL() {
            return '#';
          };
          widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

          // When
          toggleOn();

          // Then
          (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWith(attributeName, true)).toBe(true);
          (0, _expect2.default)(helper.removeDisjunctiveFacetRefinement.called).toBe(false);
        });
        it('toggle off should remove all filters', function () {
          // Given
          widget = (0, _toggle2.default)({
            container: containerNode,
            attributeName: attributeName,
            label: label,
            userValues: userValues
          });
          widget.getConfiguration();
          var state = {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(true)
          };
          var createURL = function createURL() {
            return '#';
          };
          widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

          // When
          toggleOff();

          // Then
          (0, _expect2.default)(helper.removeDisjunctiveFacetRefinement.calledWith(attributeName, true)).toBe(true);
          (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.called).toBe(false);
        });
      });
      describe('specific values', function () {
        it('toggle on should change the refined value', function () {
          // Given
          userValues = { on: 'on', off: 'off' };
          widget = (0, _toggle2.default)({
            container: containerNode,
            attributeName: attributeName,
            label: label,
            values: userValues
          });
          widget.getConfiguration();
          var state = {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(false)
          };
          var createURL = function createURL() {
            return '#';
          };
          widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

          // When
          toggleOn();

          // Then
          (0, _expect2.default)(helper.removeDisjunctiveFacetRefinement.calledWith(attributeName, 'off')).toBe(true);
          (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWith(attributeName, 'on')).toBe(true);
        });

        it('toggle off should change the refined value', function () {
          // Given
          userValues = { on: 'on', off: 'off' };
          widget = (0, _toggle2.default)({
            container: containerNode,
            attributeName: attributeName,
            label: label,
            values: userValues
          });
          widget.getConfiguration();
          var state = {
            isDisjunctiveFacetRefined: _sinon2.default.stub().returns(true)
          };
          var createURL = function createURL() {
            return '#';
          };
          widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

          // When
          toggleOff();

          // Then
          (0, _expect2.default)(helper.removeDisjunctiveFacetRefinement.calledWith(attributeName, 'on')).toBe(true);
          (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWith(attributeName, 'off')).toBe(true);
        });
      });
    });

    describe('custom off value', function () {
      var createURL = function createURL() {
        return '#';
      };
      it('should add a refinement for custom off value on init', function () {
        // Given
        userValues = { on: 'on', off: 'off' };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          values: userValues
        });
        widget.getConfiguration();
        var state = {
          isDisjunctiveFacetRefined: _sinon2.default.stub().returns(false)
        };
        var helper = {
          addDisjunctiveFacetRefinement: _sinon2.default.spy()
        };

        // When
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

        // Then
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.calledWith(attributeName, 'off')).toBe(true);
      });

      it('should not add a refinement for custom off value on init if already checked', function () {
        // Given
        userValues = { on: 'on', off: 'off' };
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          values: userValues
        });
        widget.getConfiguration();
        var state = {
          isDisjunctiveFacetRefined: _sinon2.default.stub().returns(true)
        };
        var helper = {
          addDisjunctiveFacetRefinement: _sinon2.default.spy()
        };

        // When
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

        // Then
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.called).toBe(false);
      });

      it('should not add a refinement for no custom off value on init', function () {
        // Given
        widget = (0, _toggle2.default)({
          container: containerNode,
          attributeName: attributeName,
          label: label,
          values: userValues
        });
        widget.getConfiguration();
        var state = {
          isDisjunctiveFacetRefined: function isDisjunctiveFacetRefined() {
            return false;
          }
        };
        var helper = {
          addDisjunctiveFacetRefinement: _sinon2.default.spy()
        };

        // When
        widget.init({ state: state, helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });

        // Then
        (0, _expect2.default)(helper.addDisjunctiveFacetRefinement.called).toBe(false);
      });
    });

    afterEach(function () {
      _toggle2.default.__ResetDependency__('render');
    });
  });
});