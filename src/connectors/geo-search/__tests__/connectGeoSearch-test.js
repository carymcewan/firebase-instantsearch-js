'use strict';

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _first = require('lodash/first');

var _first2 = _interopRequireDefault(_first);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectGeoSearch = require('../connectGeoSearch');

var _connectGeoSearch2 = _interopRequireDefault(_connectGeoSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createFakeClient = function createFakeClient() {
  return {
    addAlgoliaAgent: function addAlgoliaAgent() {}
  };
};

var createFakeHelper = function createFakeHelper(client) {
  var helper = (0, _algoliasearchHelper2.default)(client);

  helper.search = jest.fn();

  return helper;
};

var firstRenderArgs = function firstRenderArgs(fn) {
  return (0, _first2.default)(fn.mock.calls)[0];
};
var lastRenderArgs = function lastRenderArgs(fn) {
  return (0, _last2.default)(fn.mock.calls)[0];
};

describe('connectGeoSearch - rendering', function () {
  it('expect to be a widget', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    expect(widget).toEqual({
      getConfiguration: expect.any(Function),
      init: expect.any(Function),
      render: expect.any(Function),
      dispose: expect.any(Function)
    });
  });

  it('expect to render twice during init and render', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);
    var instantSearchInstance = { client: client, helper: helper };

    widget.init({
      state: helper.state,
      instantSearchInstance: instantSearchInstance,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenLastCalledWith({
      items: [],
      position: undefined,
      refine: expect.any(Function),
      clearMapRefinement: expect.any(Function),
      isRefinedWithMap: expect.any(Function),
      toggleRefineOnMapMove: expect.any(Function),
      isRefineOnMapMove: expect.any(Function),
      setMapMoveSinceLastRefine: expect.any(Function),
      hasMapMoveSinceLastRefine: expect.any(Function),
      widgetParams: {},
      instantSearchInstance: instantSearchInstance
    }, true);

    expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(true);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456, _geoloc: { lat: 12, lng: 14 } }, { objectID: 789, _geoloc: { lat: 14, lng: 16 } }]
      }]),
      helper: helper,
      instantSearchInstance: instantSearchInstance
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenLastCalledWith(expect.objectContaining({
      items: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456, _geoloc: { lat: 12, lng: 14 } }, { objectID: 789, _geoloc: { lat: 14, lng: 16 } }],
      position: undefined,
      refine: expect.any(Function),
      clearMapRefinement: expect.any(Function),
      toggleRefineOnMapMove: expect.any(Function),
      setMapMoveSinceLastRefine: expect.any(Function),
      widgetParams: {},
      instantSearchInstance: instantSearchInstance
    }), false);

    expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(true);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
  });

  it('expect to render with enableRefineOnMapMove disabled', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch({
      enableRefineOnMapMove: false
    });

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    widget.init({
      state: helper.state,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(false);

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]),
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(false);
  });

  it('expect to render with only geoloc hits', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456 }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
      }]),
      helper: helper
    });

    expect(render).toHaveBeenLastCalledWith(expect.objectContaining({
      items: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
    }), false);
  });

  it('expect to render with position from the state', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch({
      position: {
        lat: 10,
        lng: 12
      }
    });

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    // Simulate the configuration or external setter
    helper.setQueryParameter('aroundLatLng', '10, 12');

    widget.init({
      helper: helper,
      state: helper.state
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(expect.objectContaining({
      position: {
        lat: 10,
        lng: 12
      }
    }), true);

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: []
      }]),
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenCalledWith(expect.objectContaining({
      position: {
        lat: 10,
        lng: 12
      }
    }), false);

    // Simulate the configuration or external setter
    helper.setQueryParameter('aroundLatLng', '12, 14');

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: []
      }]),
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(3);
    expect(render).toHaveBeenCalledWith(expect.objectContaining({
      position: {
        lat: 12,
        lng: 14
      }
    }), false);
  });

  it('expect to render with insideBoundingBox from the state', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch({
      position: {
        lat: 10,
        lng: 12
      }
    });

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    // Simulate the configuration or external setter
    helper.setQueryParameter('insideBoundingBox', [[48.84174222399724, 2.367719162523599, 48.81614630305218, 2.284205902635904]]);

    widget.init({
      helper: helper,
      state: helper.state
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: []
      }]),
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    // Simulate the configuration or external setter
    helper.setQueryParameter('insideBoundingBox');

    widget.render({
      results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: []
      }]),
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(3);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
  });

  it('expect to reset the map state when position changed', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    var northEast = {
      lat: 12,
      lng: 10
    };

    var southWest = {
      lat: 40,
      lng: 42
    };

    var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
      hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456 }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
    }]);

    helper.setQueryParameter('aroundLatLng', '10,12');

    widget.render({
      results: results,
      helper: helper
    });

    lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    lastRenderArgs(render).setMapMoveSinceLastRefine();

    expect(render).toHaveBeenCalledTimes(3);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    helper.setQueryParameter('aroundLatLng', '14,16');

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(4);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
  });

  it("expect to not reset the map state when position don't changed", function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    var northEast = {
      lat: 12,
      lng: 10
    };

    var southWest = {
      lat: 40,
      lng: 42
    };

    var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
      hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456 }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
    }]);

    helper.setQueryParameter('aroundLatLng', '10,12');

    widget.render({
      results: results,
      helper: helper
    });

    lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    lastRenderArgs(render).setMapMoveSinceLastRefine();

    expect(render).toHaveBeenCalledTimes(3);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    helper.setQueryParameter('aroundLatLng', '10,12');

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(4);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
  });

  it('expect to reset the map state when boundingBox is reset', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    var northEast = {
      lat: 12,
      lng: 10
    };

    var southWest = {
      lat: 40,
      lng: 42
    };

    var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
      hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456 }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
    }]);

    helper.setQueryParameter('insideBoundingBox', '10,12,14,16');

    widget.render({
      results: results,
      helper: helper
    });

    lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    lastRenderArgs(render).setMapMoveSinceLastRefine();

    expect(render).toHaveBeenCalledTimes(3);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    helper.setQueryParameter('insideBoundingBox');

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(4);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
  });

  it('expect to not reset the map state when boundingBox is preserve', function () {
    var render = jest.fn();
    var unmount = jest.fn();

    var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
    var widget = customGeoSearch();

    var client = createFakeClient();
    var helper = createFakeHelper(client);

    var northEast = {
      lat: 12,
      lng: 10
    };

    var southWest = {
      lat: 40,
      lng: 42
    };

    var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
      hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }, { objectID: 456 }, { objectID: 789, _geoloc: { lat: 10, lng: 12 } }]
    }]);

    helper.setQueryParameter('insideBoundingBox', '10,12,14,16');

    widget.render({
      results: results,
      helper: helper
    });

    lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(2);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    lastRenderArgs(render).setMapMoveSinceLastRefine();

    expect(render).toHaveBeenCalledTimes(3);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);

    helper.setQueryParameter('insideBoundingBox', '12,14,16,18');

    widget.render({
      results: results,
      helper: helper
    });

    expect(render).toHaveBeenCalledTimes(4);
    expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
    expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
  });

  describe('refine', function () {
    it('expect to refine with the given bounds during init', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var northEast = {
        lat: 12,
        lng: 10
      };

      var southWest = {
        lat: 40,
        lng: 42
      };

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.init({
        state: helper.state,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).not.toHaveBeenCalled();

      lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
      expect(helper.getState().insideBoundingBox).toEqual('12,10,40,42');
      expect(helper.search).toHaveBeenCalledTimes(1);
    });

    it('expect to refine with the given bounds during render', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var northEast = {
        lat: 12,
        lng: 10
      };

      var southWest = {
        lat: 40,
        lng: 42
      };

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).not.toHaveBeenCalled();

      lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
      expect(helper.getState().insideBoundingBox).toEqual('12,10,40,42');
      expect(helper.search).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearMapRefinement', function () {
    it('expect to clear the map refinement after the map has been refine during init', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var northEast = {
        lat: 12,
        lng: 10
      };

      var southWest = {
        lat: 40,
        lng: 42
      };

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.init({
        state: helper.state,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).not.toHaveBeenCalled();

      lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
      expect(helper.getState().insideBoundingBox).toEqual('12,10,40,42');
      expect(helper.search).toHaveBeenCalledTimes(1);

      lastRenderArgs(render).clearMapRefinement();

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(3);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).toHaveBeenCalledTimes(2);
    });

    it('expect to clear the map refinement after the map has been refine during render', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var northEast = {
        lat: 12,
        lng: 10
      };

      var southWest = {
        lat: 40,
        lng: 42
      };

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).not.toHaveBeenCalled();

      lastRenderArgs(render).refine({ northEast: northEast, southWest: southWest });

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(true);
      expect(helper.getState().insideBoundingBox).toEqual('12,10,40,42');
      expect(helper.search).toHaveBeenCalledTimes(1);

      lastRenderArgs(render).clearMapRefinement();

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(3);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(render).isRefinedWithMap()).toBe(false);
      expect(helper.getState().insideBoundingBox).toBe(undefined);
      expect(helper.search).toHaveBeenCalledTimes(2);
    });
  });

  describe('toggleRefineOnMapMove', function () {
    it('expect to toggle refine on map move during init', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      widget.init({
        state: helper.state,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(true);

      lastRenderArgs(render).toggleRefineOnMapMove();

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(false);

      widget.render({
        results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
          hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
        }]),
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(false);
      expect(firstRenderArgs(render).toggleRefineOnMapMove).toBe(lastRenderArgs(render).toggleRefineOnMapMove);
    });

    it('expect to toggle refine on map move during render', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      widget.render({
        results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
          hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
        }]),
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(true);

      lastRenderArgs(render).toggleRefineOnMapMove();

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).isRefineOnMapMove()).toBe(false);
      expect(firstRenderArgs(render).toggleRefineOnMapMove).toBe(lastRenderArgs(render).toggleRefineOnMapMove);
    });
  });

  describe('setMapMoveSinceLastRefine', function () {
    it('expect to set map move during init', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      widget.init({
        state: helper.state,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);

      lastRenderArgs(render).setMapMoveSinceLastRefine();

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);

      widget.render({
        results: new _algoliasearchHelper.SearchResults(helper.getState(), [{
          hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
        }]),
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
      expect(firstRenderArgs(render).setMapMoveSinceLastRefine).toBe(lastRenderArgs(render).setMapMoveSinceLastRefine);
    });

    it('expect to set map move during render', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);

      lastRenderArgs(render).setMapMoveSinceLastRefine();

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
      expect(firstRenderArgs(render).setMapMoveSinceLastRefine).toBe(lastRenderArgs(render).setMapMoveSinceLastRefine);
    });

    it('expect to set map move during render & trigger render only when value change', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      var results = new _algoliasearchHelper.SearchResults(helper.getState(), [{
        hits: [{ objectID: 123, _geoloc: { lat: 10, lng: 12 } }]
      }]);

      widget.render({
        results: results,
        helper: helper
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(false);

      lastRenderArgs(render).setMapMoveSinceLastRefine();

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);

      lastRenderArgs(render).setMapMoveSinceLastRefine();

      expect(render).toHaveBeenCalledTimes(2);
      expect(lastRenderArgs(render).hasMapMoveSinceLastRefine()).toBe(true);
      expect(firstRenderArgs(render).setMapMoveSinceLastRefine).toBe(lastRenderArgs(render).setMapMoveSinceLastRefine);
    });
  });
});

describe('connectGeoSearch - getConfiguration', function () {
  describe('aroundLatLngViaIP', function () {
    it('expect to set aroundLatLngViaIP', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        enableGeolocationWithIP: true
      });

      var expectation = {
        aroundLatLngViaIP: true
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters());

      expect(actual).toEqual(expectation);
    });

    it('expect to not set aroundLatLngViaIP when position is given', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        enableGeolocationWithIP: true,
        position: {
          lat: 12,
          lng: 10
        }
      });

      var expectation = {
        aroundLatLng: '12, 10'
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters());

      expect(actual).toEqual(expectation);
    });

    it("expect to not set aroundLatLngViaIP when it's already set", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        enableGeolocationWithIP: true
      });

      var expectation = {};

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundLatLngViaIP: false
      }));

      expect(actual).toEqual(expectation);
    });

    it('expect to not set aroundLatLngViaIP when aroundLatLng is already set', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        enableGeolocationWithIP: true
      });

      var expectation = {};

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundLatLng: '10, 12'
      }));

      expect(actual).toEqual(expectation);
    });
  });

  describe('aroundLatLng', function () {
    it('expect to set aroundLatLng', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 12,
          lng: 10
        }
      });

      var expectation = {
        aroundLatLng: '12, 10'
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters());

      expect(actual).toEqual(expectation);
    });

    it('expect to set aroundLatLng when aroundLatLngViaIP is already set to false', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 12,
          lng: 10
        }
      });

      var expectation = {
        aroundLatLng: '12, 10'
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundLatLngViaIP: false
      }));

      expect(actual).toEqual(expectation);
    });

    it("expect to not set aroundLatLng when it's already set", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 12,
          lng: 10
        }
      });

      var expectation = {};

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundLatLng: '12, 12'
      }));

      expect(actual).toEqual(expectation);
    });

    it('expect to not set aroundLatLng when aroundLatLngViaIP is already set to true', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 12,
          lng: 10
        }
      });

      var expectation = {};

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundLatLngViaIP: true
      }));

      expect(actual).toEqual(expectation);
    });
  });

  describe('aroundRadius', function () {
    it('expect to set aroundRadius', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        radius: 1000
      });

      var expectation = {
        aroundLatLngViaIP: true,
        aroundRadius: 1000
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters());

      expect(actual).toEqual(expectation);
    });

    it("expect to not set aroundRadius when it's already defined", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        radius: 1000
      });

      var expectation = {
        aroundLatLngViaIP: true
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundRadius: 500
      }));

      expect(actual).toEqual(expectation);
    });
  });

  describe('aroundPrecision', function () {
    it('expect to set aroundPrecision', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        precision: 1000
      });

      var expectation = {
        aroundLatLngViaIP: true,
        aroundPrecision: 1000
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters());

      expect(actual).toEqual(expectation);
    });

    it("expect to not set aroundPrecision when it's already defined", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        precision: 1000
      });

      var expectation = {
        aroundLatLngViaIP: true
      };

      var actual = widget.getConfiguration(new _algoliasearchHelper.SearchParameters({
        aroundPrecision: 500
      }));

      expect(actual).toEqual(expectation);
    });
  });
});

describe('connectGeoSearch - dispose', function () {
  describe('aroundLatLngViaIP', function () {
    it('expect reset aroundLatLngViaIP', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters()));

      var expectation = {
        aroundLatLngViaIP: undefined
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });

    it("expect to not reset aroundLatLngViaIP when it's not set by the widget", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        enableGeolocationWithIP: false
      });

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters())).setQueryParameter('aroundLatLngViaIP', true);

      var expectation = {
        aroundLatLngViaIP: true
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });

    it('expect to not reset aroundLatLngViaIP when position is given', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 10,
          lng: 12
        }
      });

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters())).setQueryParameter('aroundLatLngViaIP', true);

      var expectation = {
        aroundLatLngViaIP: true
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });
  });

  describe('aroundLatLng', function () {
    it('expect to reset aroundLatLng', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        position: {
          lat: 10,
          lng: 12
        }
      });

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters()));

      var expectation = {
        aroundLatLng: undefined
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });

    it("expect to not reset aroundLatLng when it's not set by the widget", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters())).setQueryParameter('aroundLatLng', '10, 12');

      var expectation = {
        aroundLatLng: '10, 12'
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });
  });

  describe('aroundRadius', function () {
    it('expect to reset aroundRadius', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        radius: 1000
      });

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters()));

      var expectation = {
        aroundRadius: undefined
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });

    it("expect to not reset aroundRadius when it's not set by the widget", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters())).setQueryParameter('aroundRadius', 1000);

      var expectation = {
        aroundRadius: 1000
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });
  });

  describe('aroundPrecision', function () {
    it('expect to reset aroundPrecision', function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch({
        precision: 1000
      });

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters()));

      var expectation = {
        aroundPrecision: undefined
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });

    it("expect to not reset aroundPrecision when it's not set by the widget", function () {
      var render = jest.fn();
      var unmount = jest.fn();

      var customGeoSearch = (0, _connectGeoSearch2.default)(render, unmount);
      var widget = customGeoSearch();

      var client = createFakeClient();
      var helper = createFakeHelper(client);

      helper.setState(widget.getConfiguration(new _algoliasearchHelper.SearchParameters())).setQueryParameter('aroundPrecision', 1000);

      var expectation = {
        aroundPrecision: 1000
      };

      var actual = widget.dispose({ state: helper.getState() });

      expect(unmount).toHaveBeenCalled();
      expect(actual).toMatchObject(expectation);
    });
  });
});