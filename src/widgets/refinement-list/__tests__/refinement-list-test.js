'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _refinementList = require('../refinement-list.js');

var _refinementList2 = _interopRequireDefault(_refinementList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchParameters = _algoliasearchHelper2.default.SearchParameters;

var instantSearchInstance = { templatesConfig: {} };

describe('refinementList()', function () {
  var autoHideContainer = void 0;
  var container = void 0;
  var headerFooter = void 0;
  var options = void 0;
  var widget = void 0;
  var ReactDOM = void 0;

  beforeEach(function () {
    container = document.createElement('div');

    ReactDOM = { render: _sinon2.default.spy() };
    _refinementList2.default.__Rewire__('render', ReactDOM.render);
    autoHideContainer = _sinon2.default.stub().returnsArg(0);
    _refinementList2.default.__Rewire__('autoHideContainerHOC', autoHideContainer);
    headerFooter = _sinon2.default.stub().returnsArg(0);
    _refinementList2.default.__Rewire__('headerFooterHOC', headerFooter);
  });

  describe('instantiated with wrong parameters', function () {
    it('should fail if no container', function () {
      // Given
      options = { container: undefined, attributeName: 'foo' };

      // Then
      expect(function () {
        // When
        (0, _refinementList2.default)(options);
      }).toThrow(/^Usage:/);
    });
  });

  describe('render', function () {
    var helper = {};
    var results = void 0;
    var state = void 0;
    var createURL = void 0;

    function renderWidget(userOptions) {
      widget = (0, _refinementList2.default)(_extends({}, options, userOptions));
      widget.init({ helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance });
      return widget.render({ results: results, helper: helper, state: state });
    }

    beforeEach(function () {
      options = { container: container, attributeName: 'attributeName' };
      results = {
        getFacetValues: _sinon2.default.stub().returns([{ name: 'foo' }, { name: 'bar' }])
      };
      state = SearchParameters.make({});
      createURL = function createURL() {
        return '#';
      };
    });

    describe('cssClasses', function () {
      it('should call the component with the correct classes', function () {
        // Given
        var cssClasses = {
          root: ['root', 'cx'],
          header: 'header',
          body: 'body',
          footer: 'footer',
          list: 'list',
          item: 'item',
          active: 'active',
          label: 'label',
          checkbox: 'checkbox',
          count: 'count'
        };

        // When
        renderWidget({ cssClasses: cssClasses });
        var actual = ReactDOM.render.firstCall.args[0].props.cssClasses;

        // Then
        expect(actual.root).toBe('ais-refinement-list root cx');
        expect(actual.header).toBe('ais-refinement-list--header header');
        expect(actual.body).toBe('ais-refinement-list--body body');
        expect(actual.footer).toBe('ais-refinement-list--footer footer');
        expect(actual.list).toBe('ais-refinement-list--list list');
        expect(actual.item).toBe('ais-refinement-list--item item');
        expect(actual.active).toBe('ais-refinement-list--item__active active');
        expect(actual.label).toBe('ais-refinement-list--label label');
        expect(actual.checkbox).toBe('ais-refinement-list--checkbox checkbox');
        expect(actual.count).toBe('ais-refinement-list--count count');
      });
    });

    describe('autoHideContainer', function () {
      it('should set shouldAutoHideContainer to false if there are facetValues', function () {
        // Given
        results.getFacetValues = _sinon2.default.stub().returns([{ name: 'foo' }, { name: 'bar' }]);

        // When
        renderWidget();
        var actual = ReactDOM.render.firstCall.args[0].props.shouldAutoHideContainer;

        // Then
        expect(actual).toBe(false);
      });
      it('should set shouldAutoHideContainer to true if no facet values', function () {
        // Given
        results.getFacetValues = _sinon2.default.stub().returns([]);

        // When
        renderWidget();
        var actual = ReactDOM.render.firstCall.args[0].props.shouldAutoHideContainer;

        // Then
        expect(actual).toBe(true);
      });
    });

    describe('header', function () {
      it('should pass the refined count to the header data', function () {
        // Given
        var facetValues = [{
          name: 'foo',
          isRefined: true
        }, {
          name: 'bar',
          isRefined: true
        }, {
          name: 'baz',
          isRefined: false
        }];
        results.getFacetValues = _sinon2.default.stub().returns(facetValues);

        // When
        renderWidget();
        var props = ReactDOM.render.firstCall.args[0].props;

        // Then
        expect(props.headerFooterData.header.refinedFacetsCount).toEqual(2);
      });

      it('should dynamically update the header template on subsequent renders', function () {
        // Given
        var widgetOptions = { container: container, attributeName: 'type' };
        var initOptions = { helper: helper, createURL: createURL, instantSearchInstance: instantSearchInstance };
        var facetValues = [{
          name: 'foo',
          isRefined: true
        }, {
          name: 'bar',
          isRefined: false
        }];
        results.getFacetValues = _sinon2.default.stub().returns(facetValues);
        var renderOptions = { results: results, helper: helper, state: state };

        // When
        widget = (0, _refinementList2.default)(widgetOptions);
        widget.init(initOptions);
        widget.render(renderOptions);

        // Then
        var props = ReactDOM.render.firstCall.args[0].props;
        expect(props.headerFooterData.header.refinedFacetsCount).toEqual(1);

        // When... second render call
        facetValues[1].isRefined = true;
        widget.render(renderOptions);

        // Then
        props = ReactDOM.render.secondCall.args[0].props;
        expect(props.headerFooterData.header.refinedFacetsCount).toEqual(2);
      });
    });
  });

  describe('show more', function () {
    it('should return a configuration with the highest limit value (default value)', function () {
      var opts = {
        container: container,
        attributeName: 'attributeName',
        limit: 1,
        showMore: {}
      };
      var wdgt = (0, _refinementList2.default)(opts);
      var partialConfig = wdgt.getConfiguration({});
      expect(partialConfig.maxValuesPerFacet).toBe(100);
    });

    it('should return a configuration with the highest limit value (custom value)', function () {
      var opts = {
        container: container,
        attributeName: 'attributeName',
        limit: 1,
        showMore: { limit: 99 }
      };
      var wdgt = (0, _refinementList2.default)(opts);
      var partialConfig = wdgt.getConfiguration({});
      expect(partialConfig.maxValuesPerFacet).toBe(opts.showMore.limit);
    });

    it('should not accept a show more limit that is < limit', function () {
      var opts = {
        container: container,
        attributeName: 'attributeName',
        limit: 100,
        showMore: { limit: 1 }
      };
      expect(function () {
        return (0, _refinementList2.default)(opts);
      }).toThrow();
    });
  });
});