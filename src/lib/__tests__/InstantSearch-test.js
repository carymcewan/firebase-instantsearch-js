'use strict';

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _times = require('lodash/times');

var _times2 = _interopRequireDefault(_times);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _InstantSearch = require('../InstantSearch');

var _InstantSearch2 = _interopRequireDefault(_InstantSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('InstantSearch lifecycle', function () {
  var algoliasearch = void 0;
  var helperStub = void 0;
  var client = void 0;
  var helper = void 0;
  var appId = void 0;
  var apiKey = void 0;
  var indexName = void 0;
  var searchParameters = void 0;
  var search = void 0;
  var helperSearchSpy = void 0;
  var urlSync = void 0;

  beforeEach(function () {
    client = { algolia: 'client', addAlgoliaAgent: function addAlgoliaAgent() {} };
    helper = (0, _algoliasearchHelper2.default)(client);

    // when using searchFunction, we lose the reference to
    // the original helper.search
    var spy = _sinon2.default.spy();

    helper.search = spy;
    helperSearchSpy = spy;

    urlSync = {
      createURL: _sinon2.default.spy(),
      onHistoryChange: function onHistoryChange() {},
      getConfiguration: _sinon2.default.spy(),
      render: function render() {}
    };

    algoliasearch = _sinon2.default.stub().returns(client);
    helperStub = _sinon2.default.stub().returns(helper);

    appId = 'appId';
    apiKey = 'apiKey';
    indexName = 'lifecycle';

    searchParameters = {
      some: 'configuration',
      values: [-2, -1],
      index: indexName,
      another: { config: 'parameter' }
    };

    _InstantSearch2.default.__Rewire__('urlSyncWidget', function () {
      return urlSync;
    });
    _InstantSearch2.default.__Rewire__('algoliasearch', algoliasearch);
    _InstantSearch2.default.__Rewire__('algoliasearchHelper', helperStub);

    search = new _InstantSearch2.default({
      appId: appId,
      apiKey: apiKey,
      indexName: indexName,
      searchParameters: searchParameters,
      urlSync: {}
    });
  });

  afterEach(function () {
    _InstantSearch2.default.__ResetDependency__('urlSyncWidget');
    _InstantSearch2.default.__ResetDependency__('algoliasearch');
    _InstantSearch2.default.__ResetDependency__('algoliasearchHelper');
  });

  it('calls algoliasearch(appId, apiKey)', function () {
    expect(algoliasearch.calledOnce).toBe(true, 'algoliasearch called once');
    expect(algoliasearch.args[0]).toEqual([appId, apiKey]);
  });

  it('does not call algoliasearchHelper', function () {
    expect(helperStub.notCalled).toBe(true, 'algoliasearchHelper not yet called');
  });

  describe('when providing a custom client module', function () {
    var createAlgoliaClient = void 0;
    var customAppID = void 0;
    var customApiKey = void 0;

    beforeEach(function () {
      // InstantSearch is being called once at the top-level context, so reset the `algoliasearch` spy
      algoliasearch.resetHistory();

      // Create a spy to act as a clientInstanceFunction that returns a custom client
      createAlgoliaClient = _sinon2.default.stub().returns(client);
      customAppID = 'customAppID';
      customApiKey = 'customAPIKey';

      // Create a new InstantSearch instance with custom client function
      search = new _InstantSearch2.default({
        appId: customAppID,
        apiKey: customApiKey,
        indexName: indexName,
        searchParameters: searchParameters,
        urlSync: {},
        createAlgoliaClient: createAlgoliaClient
      });
    });

    it('does not call algoliasearch directly', function () {
      expect(algoliasearch.calledOnce).toBe(false, 'algoliasearch not called');
    });

    it('calls createAlgoliaClient(appId, apiKey)', function () {
      expect(createAlgoliaClient.calledOnce).toBe(true, 'clientInstanceFunction called once');
      expect(createAlgoliaClient.args[0]).toEqual([algoliasearch, customAppID, customApiKey]);
    });
  });

  describe('when adding a widget without render and init', function () {
    var widget = void 0;

    beforeEach(function () {
      widget = {};
    });

    it('throw an error', function () {
      expect(function () {
        search.addWidget(widget);
      }).toThrow('Widget definition missing render or init method');
    });
  });

  it('does not fail when passing same references inside multiple searchParameters props', function () {
    var disjunctiveFacetsRefinements = { fruits: ['apple'] };
    var facetsRefinements = disjunctiveFacetsRefinements;
    search = new _InstantSearch2.default({
      appId: appId,
      apiKey: apiKey,
      indexName: indexName,
      searchParameters: {
        disjunctiveFacetsRefinements: disjunctiveFacetsRefinements,
        facetsRefinements: facetsRefinements
      }
    });
    search.addWidget({
      getConfiguration: function getConfiguration() {
        return {
          disjunctiveFacetsRefinements: { fruits: ['orange'] }
        };
      },
      init: function init() {}
    });
    search.start();
    expect(search.searchParameters.facetsRefinements).toEqual({
      fruits: ['apple']
    });
  });

  describe('when adding a widget', function () {
    var widget = void 0;

    beforeEach(function () {
      widget = {
        getConfiguration: _sinon2.default.stub().returns({ some: 'modified', another: { different: 'parameter' } }),
        init: _sinon2.default.spy(function () {
          helper.state.sendMeToUrlSync = true;
        }),
        render: _sinon2.default.spy()
      };
      search.addWidget(widget);
    });

    it('does not call widget.getConfiguration', function () {
      expect(widget.getConfiguration.notCalled).toBe(true);
    });

    describe('when we call search.start', function () {
      beforeEach(function () {
        search.start();
      });

      it('calls widget.getConfiguration(searchParameters)', function () {
        expect(widget.getConfiguration.args[0]).toEqual([searchParameters, undefined]);
      });

      it('calls algoliasearchHelper(client, indexName, searchParameters)', function () {
        expect(helperStub.calledOnce).toBe(true, 'algoliasearchHelper called once');
        expect(helperStub.args[0]).toEqual([client, indexName, {
          some: 'modified',
          values: [-2, -1],
          index: indexName,
          another: { different: 'parameter', config: 'parameter' }
        }]);
      });

      it('calls helper.search()', function () {
        expect(helperSearchSpy.calledOnce).toBe(true);
      });

      it('calls widget.init(helper.state, helper, templatesConfig)', function () {
        expect(widget.init.calledOnce).toBe(true, 'widget.init called once');
        expect(widget.init.calledAfter(widget.getConfiguration)).toBe(true, 'widget.init() was called after widget.getConfiguration()');
        var args = widget.init.args[0][0];
        expect(args.state).toBe(helper.state);
        expect(args.helper).toBe(helper);
        expect(args.templatesConfig).toBe(search.templatesConfig);
        expect(args.onHistoryChange).toBe(search._onHistoryChange);
      });

      it('calls urlSync.getConfiguration after every widget', function () {
        expect(urlSync.getConfiguration.calledOnce).toBe(true, 'urlSync.getConfiguration called once');
        expect(urlSync.getConfiguration.calledAfter(widget.getConfiguration)).toBe(true, 'urlSync.getConfiguration was called after widget.init');
      });

      it('does not call widget.render', function () {
        expect(widget.render.notCalled).toBe(true);
      });

      describe('when we have results', function () {
        var results = void 0;

        beforeEach(function () {
          results = { some: 'data' };
          helper.emit('result', results, helper.state);
        });

        it('calls widget.render({results, state, helper, templatesConfig, instantSearchInstance})', function () {
          expect(widget.render.calledOnce).toBe(true, 'widget.render called once');
          expect(widget.render.args[0]).toMatchSnapshot();
        });
      });
    });
  });

  describe('when we have 5 widgets', function () {
    var widgets = void 0;

    beforeEach(function () {
      widgets = (0, _range2.default)(5);
      widgets = widgets.map(function (widget, widgetIndex) {
        return {
          init: function init() {},

          getConfiguration: _sinon2.default.stub().returns({ values: [widgetIndex] })
        };
      });
      widgets.forEach(search.addWidget, search);
      search.start();
    });

    it('calls widget[x].getConfiguration in the orders the widgets were added', function () {
      var order = widgets.every(function (widget, widgetIndex, filteredWidgets) {
        if (widgetIndex === 0) {
          return widget.getConfiguration.calledOnce && widget.getConfiguration.calledBefore(filteredWidgets[1].getConfiguration);
        }
        var previousWidget = filteredWidgets[widgetIndex - 1];
        return widget.getConfiguration.calledOnce && widget.getConfiguration.calledAfter(previousWidget.getConfiguration);
      });

      expect(order).toBe(true);
    });

    it('recursively merges searchParameters.values array', function () {
      expect(helperStub.args[0][2].values).toEqual([-2, -1, 0, 1, 2, 3, 4]);
    });
  });

  describe('when render happens', function () {
    var render = _sinon2.default.spy();
    beforeEach(function () {
      render.resetHistory();
      var widgets = (0, _range2.default)(5).map(function () {
        return { render: render };
      });

      widgets.forEach(search.addWidget, search);

      search.start();
    });

    it('has a createURL method', function () {
      search.createURL({ hitsPerPage: 542 });
      expect(urlSync.createURL.calledOnce).toBe(true);
      expect(urlSync.createURL.getCall(0).args[0].hitsPerPage).toBe(542);
    });

    it('emits render when all render are done (using on)', function () {
      var onRender = _sinon2.default.spy();
      search.on('render', onRender);

      expect(render.callCount).toEqual(0);
      expect(onRender.callCount).toEqual(0);

      helper.emit('result', {}, helper.state);

      expect(render.callCount).toEqual(5);
      expect(onRender.callCount).toEqual(1);
      expect(render.calledBefore(onRender)).toBe(true);

      helper.emit('result', {}, helper.state);

      expect(render.callCount).toEqual(10);
      expect(onRender.callCount).toEqual(2);
    });

    it('emits render when all render are done (using once)', function () {
      var onRender = _sinon2.default.spy();
      search.once('render', onRender);

      expect(render.callCount).toEqual(0);
      expect(onRender.callCount).toEqual(0);

      helper.emit('result', {}, helper.state);

      expect(render.callCount).toEqual(5);
      expect(onRender.callCount).toEqual(1);
      expect(render.calledBefore(onRender)).toBe(true);

      helper.emit('result', {}, helper.state);

      expect(render.callCount).toEqual(10);
      expect(onRender.callCount).toEqual(1);
    });
  });

  describe('When removing a widget', function () {
    function registerWidget() {
      var widgetGetConfiguration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        facets: ['categories'],
        maxValuesPerFacet: 10
      };
      var dispose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jest.fn();

      var widget = {
        getConfiguration: jest.fn(function () {
          return widgetGetConfiguration;
        }),
        init: jest.fn(),
        render: jest.fn(),
        dispose: dispose
      };

      search.addWidget(widget);

      return widget;
    }

    beforeEach(function () {
      search = new _InstantSearch2.default({
        appId: appId,
        apiKey: apiKey,
        indexName: indexName
      });
    });

    it('should unmount a widget without configuration', function () {
      var widget1 = registerWidget({});
      var widget2 = registerWidget({});

      expect(search.widgets).toHaveLength(2);

      search.start();
      search.removeWidget(widget1);
      search.removeWidget(widget2);

      expect(search.widgets).toHaveLength(0);
    });

    it('should unmount a widget with facets configuration', function () {
      var widget1 = registerWidget({ facets: ['price'] }, function (_ref) {
        var state = _ref.state;
        return state.removeFacet('price');
      });
      search.start();

      expect(search.widgets).toHaveLength(1);
      expect(search.searchParameters.facets).toEqual(['price']);

      search.removeWidget(widget1);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.facets).toEqual([]);
    });

    it('should unmount a widget with hierarchicalFacets configuration', function () {
      var widget1 = registerWidget({
        hierarchicalFacets: [{
          name: 'price',
          attributes: ['foo'],
          separator: ' > ',
          rootPath: 'lvl1',
          showParentLevel: true
        }]
      }, function (_ref2) {
        var state = _ref2.state;
        return state.removeHierarchicalFacet('price');
      });
      search.start();

      expect(search.widgets).toHaveLength(1);
      expect(search.searchParameters.hierarchicalFacets).toEqual([{
        name: 'price',
        attributes: ['foo'],
        separator: ' > ',
        rootPath: 'lvl1',
        showParentLevel: true
      }]);

      search.removeWidget(widget1);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.hierarchicalFacets).toEqual([]);
    });

    it('should unmount a widget with disjunctiveFacets configuration', function () {
      var widget1 = registerWidget({ disjunctiveFacets: ['price'] }, function (_ref3) {
        var state = _ref3.state;
        return state.removeDisjunctiveFacet('price');
      });
      search.start();

      expect(search.widgets).toHaveLength(1);
      expect(search.searchParameters.disjunctiveFacets).toEqual(['price']);

      search.removeWidget(widget1);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.disjunctiveFacets).toEqual([]);
    });

    it('should unmount a widget with numericRefinements configuration', function () {
      var widget1 = registerWidget({ numericRefinements: { price: {} } }, function (_ref4) {
        var state = _ref4.state;
        return state.removeNumericRefinement('price');
      });
      search.start();

      expect(search.widgets).toHaveLength(1);
      expect(search.searchParameters.numericRefinements).toEqual({ price: {} });

      search.removeWidget(widget1);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.numericRefinements).toEqual({});
    });

    it('should unmount a widget with maxValuesPerFacet configuration', function () {
      var widget1 = registerWidget(undefined, function (_ref5) {
        var state = _ref5.state;
        return state.removeFacet('categories').setQueryParameters('maxValuesPerFacet', undefined);
      });
      search.start();

      expect(search.widgets).toHaveLength(1);
      expect(search.searchParameters.facets).toEqual(['categories']);
      expect(search.searchParameters.maxValuesPerFacet).toEqual(10);

      search.removeWidget(widget1);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.facets).toEqual([]);
      expect(search.searchParameters.maxValuesPerFacet).toBe(undefined);
    });

    it('should unmount multiple widgets at once', function () {
      var widget1 = registerWidget({ numericRefinements: { price: {} } }, function (_ref6) {
        var state = _ref6.state;
        return state.removeNumericRefinement('price');
      });
      var widget2 = registerWidget({ disjunctiveFacets: ['price'] }, function (_ref7) {
        var state = _ref7.state;
        return state.removeDisjunctiveFacet('price');
      });

      search.start();

      expect(search.widgets).toHaveLength(2);
      expect(search.searchParameters.numericRefinements).toEqual({ price: {} });
      expect(search.searchParameters.disjunctiveFacets).toEqual(['price']);

      search.removeWidgets([widget1, widget2]);

      expect(search.widgets).toHaveLength(0);
      expect(search.searchParameters.numericRefinements).toEqual({});
      expect(search.searchParameters.disjunctiveFacets).toEqual([]);
    });

    it('should unmount a widget without calling URLSync widget getConfiguration', function () {
      // fake url-sync widget
      var spy = jest.fn();

      var URLSync = function URLSync() {
        _classCallCheck(this, URLSync);

        this.getConfiguration = spy;
        this.init = jest.fn();
        this.render = jest.fn();
        this.dispose = jest.fn();
      };

      var urlSyncWidget = new URLSync();
      expect(urlSyncWidget.constructor.name).toEqual('URLSync');

      search.addWidget(urlSyncWidget);

      // add fake widget to dispose
      // that returns a `nextState` while dispose
      var widget1 = registerWidget(undefined, jest.fn(function (_ref8) {
        var nextState = _ref8.state;
        return nextState;
      }));

      var widget2 = registerWidget();
      search.start();

      // remove widget1
      search.removeWidget(widget1);

      // it should have been called only once after start();
      expect(spy).toHaveBeenCalledTimes(1);

      // but widget2 getConfiguration() should have been called twice
      expect(widget2.getConfiguration).toHaveBeenCalledTimes(2);
    });
  });

  describe('When adding widgets after start', function () {
    function registerWidget() {
      var widgetGetConfiguration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var dispose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _sinon2.default.spy();

      var widget = {
        getConfiguration: _sinon2.default.stub().returns(widgetGetConfiguration),
        init: _sinon2.default.spy(),
        render: _sinon2.default.spy(),
        dispose: dispose
      };

      return widget;
    }

    beforeEach(function () {
      search = new _InstantSearch2.default({
        appId: appId,
        apiKey: apiKey,
        indexName: indexName
      });
    });

    it('should add widgets after start', function () {
      search.start();
      expect(helperSearchSpy.callCount).toBe(1);

      expect(search.widgets).toHaveLength(0);
      expect(search.started).toBe(true);

      var widget1 = registerWidget({ facets: ['price'] });
      search.addWidget(widget1);

      expect(helperSearchSpy.callCount).toBe(2);
      expect(widget1.init.calledOnce).toBe(true);

      var widget2 = registerWidget({ disjunctiveFacets: ['categories'] });
      search.addWidget(widget2);

      expect(widget2.init.calledOnce).toBe(true);
      expect(helperSearchSpy.callCount).toBe(3);

      expect(search.widgets).toHaveLength(2);
      expect(search.searchParameters.facets).toEqual(['price']);
      expect(search.searchParameters.disjunctiveFacets).toEqual(['categories']);
    });

    it('should trigger only one search using `addWidgets()`', function () {
      search.start();

      expect(helperSearchSpy.callCount).toBe(1);
      expect(search.widgets).toHaveLength(0);
      expect(search.started).toBe(true);

      var widget1 = registerWidget({ facets: ['price'] });
      var widget2 = registerWidget({ disjunctiveFacets: ['categories'] });

      search.addWidgets([widget1, widget2]);

      expect(helperSearchSpy.callCount).toBe(2);
      expect(search.searchParameters.facets).toEqual(['price']);
      expect(search.searchParameters.disjunctiveFacets).toEqual(['categories']);
    });
  });

  it('should remove all widgets without triggering a search on dispose', function () {
    search = new _InstantSearch2.default({
      appId: appId,
      apiKey: apiKey,
      indexName: indexName
    });

    var widgets = (0, _times2.default)(5, function () {
      return {
        getConfiguration: function getConfiguration() {
          return {};
        },
        init: jest.fn(),
        render: jest.fn(),
        dispose: jest.fn()
      };
    });

    search.addWidgets(widgets);
    search.start();

    expect(search.widgets).toHaveLength(5);
    expect(helperSearchSpy.callCount).toBe(1);

    search.dispose();

    expect(search.widgets).toHaveLength(0);
    expect(helperSearchSpy.callCount).toBe(1);
  });
});