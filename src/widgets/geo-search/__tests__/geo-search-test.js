'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _preactCompat = require('preact-compat');

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _createHTMLMarker = require('../createHTMLMarker');

var _createHTMLMarker2 = _interopRequireDefault(_createHTMLMarker);

var _GeoSearchRenderer = require('../GeoSearchRenderer');

var _GeoSearchRenderer2 = _interopRequireDefault(_GeoSearchRenderer);

var _geoSearch = require('../geo-search');

var _geoSearch2 = _interopRequireDefault(_geoSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

jest.mock('preact-compat', function () {
  var module = require.requireActual('preact-compat');

  module.render = jest.fn();

  return module;
});

jest.mock('../GeoSearchRenderer', function () {
  var module = require.requireActual('../GeoSearchRenderer');

  return jest.fn(function () {
    return module.default.apply(module, arguments);
  });
});

jest.mock('../createHTMLMarker');

describe('GeoSearch', function () {
  var createFakeMapInstance = function createFakeMapInstance() {
    return {
      addListener: jest.fn(),
      getCenter: jest.fn(),
      setCenter: jest.fn(),
      getZoom: jest.fn(),
      setZoom: jest.fn(),
      getBounds: jest.fn(function () {
        return {
          getNorthEast: jest.fn(),
          getSouthWest: jest.fn()
        };
      }),
      getProjection: jest.fn(function () {
        return {
          fromPointToLatLng: jest.fn(function () {
            return {
              lat: jest.fn(),
              lng: jest.fn()
            };
          }),
          fromLatLngToPoint: jest.fn(function () {
            return {
              x: 0,
              y: 0
            };
          })
        };
      }),
      fitBounds: jest.fn()
    };
  };

  var createFakeMarkerInstance = function createFakeMarkerInstance() {
    return {
      setMap: jest.fn(),
      getPosition: jest.fn(),
      addListener: jest.fn()
    };
  };

  var createFakeGoogleReference = function createFakeGoogleReference() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$mapInstance = _ref.mapInstance,
        mapInstance = _ref$mapInstance === undefined ? createFakeMapInstance() : _ref$mapInstance,
        _ref$markerInstance = _ref.markerInstance,
        markerInstance = _ref$markerInstance === undefined ? createFakeMarkerInstance() : _ref$markerInstance;

    return {
      maps: {
        LatLng: jest.fn(),
        LatLngBounds: jest.fn(function () {
          return {
            extend: jest.fn().mockReturnThis()
          };
        }),
        Map: jest.fn(function () {
          return mapInstance;
        }),
        Marker: jest.fn(function (args) {
          return _extends({}, args, markerInstance);
        }),
        ControlPosition: {
          LEFT_TOP: 'left:top'
        },
        event: {
          addListenerOnce: jest.fn()
        },
        OverlayView: {
          setMap: jest.fn(),
          getPanes: jest.fn(function () {
            return {
              overlayMouseTarget: {
                appendChild: jest.fn()
              }
            };
          }),
          getProjection: jest.fn(function () {
            return {
              fromLatLngToDivPixel: jest.fn(function () {
                return {
                  x: 0,
                  y: 0
                };
              })
            };
          })
        }
      }
    };
  };

  var createContainer = function createContainer() {
    return document.createElement('div');
  };
  var createFakeInstantSearch = function createFakeInstantSearch() {
    return { templatesConfig: undefined };
  };
  var createFakeHelper = function createFakeHelper() {
    return (0, _algoliasearchHelper2.default)({
      search: function search() {},
      addAlgoliaAgent: function addAlgoliaAgent() {
        return {};
      }
    }, 'indexName');
  };

  var lastRenderArgs = function lastRenderArgs(fn) {
    return (0, _last2.default)(fn.mock.calls)[0];
  };
  var lastRenderState = function lastRenderState(fn) {
    return lastRenderArgs(fn).widgetParams.renderState;
  };

  var simulateMapReadyEvent = function simulateMapReadyEvent(google) {
    google.maps.event.addListenerOnce.mock.calls[0][2]();
  };

  var simulateEvent = function simulateEvent(fn, eventName, event) {
    fn.addListener.mock.calls.find(function (call) {
      return call.includes(eventName);
    })[1](event);
  };

  beforeEach(function () {
    _preactCompat.render.mockClear();
    _GeoSearchRenderer2.default.mockClear();
  });

  it('expect to render', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container
    });

    widget.init({
      instantSearchInstance: instantSearchInstance,
      helper: helper,
      state: helper.state
    });

    widget.render({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      results: {
        hits: []
      }
    });

    expect(container.innerHTML).toMatchSnapshot();
    expect(_preactCompat.render.mock.calls[0]).toMatchSnapshot();
  });

  it('expect to render with custom classNames', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container,
      cssClasses: {
        root: 'custom-root',
        map: 'custom-map',
        controls: 'custom-controls',
        clear: 'custom-clear',
        control: 'custom-control',
        toggleLabel: 'custom-toggleLabel',
        toggleInput: 'custom-toggleInput',
        redo: 'custom-redo'
      }
    });

    widget.init({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      state: helper.state
    });

    widget.render({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      results: {
        hits: []
      }
    });

    expect(container.innerHTML).toMatchSnapshot();
    expect(_preactCompat.render.mock.calls[0]).toMatchSnapshot();
  });

  it('expect to render with custom template', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container,
      templates: {
        toggle: 'Search when the map move'
      }
    });

    widget.init({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      state: helper.state
    });

    widget.render({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      results: {
        hits: []
      }
    });

    var actual = _GeoSearchRenderer2.default.mock.calls[0][0].widgetParams.templates;

    var expectation = {
      clear: 'Clear the map refinement',
      toggle: 'Search when the map move',
      redo: 'Redo search here'
    };

    expect(actual).toEqual(expectation);
  });

  it('expect to render with custom paddingBoundingBoc', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container,
      paddingBoundingBox: {
        top: 10
      }
    });

    widget.init({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      state: helper.state
    });

    widget.render({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      results: {
        hits: []
      }
    });

    var actual = _GeoSearchRenderer2.default.mock.calls[0][0].widgetParams.paddingBoundingBox;

    var expectation = {
      top: 10,
      right: 0,
      bottom: 0,
      left: 0
    };

    expect(actual).toEqual(expectation);
  });

  it('expect to render the map with default options', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container
    });

    widget.init({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      state: helper.state
    });

    expect(googleReference.maps.Map).toHaveBeenCalledWith(expect.anything(), {
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      clickableIcons: false,
      zoomControlOptions: {
        position: 'left:top'
      }
    });
  });

  it('expect to render the map with given options', function () {
    var container = createContainer();
    var instantSearchInstance = createFakeInstantSearch();
    var helper = createFakeHelper();
    var googleReference = createFakeGoogleReference();

    var widget = (0, _geoSearch2.default)({
      googleReference: googleReference,
      container: container,
      mapOptions: {
        otherMapSpecific: 'value',
        clickableIcons: true,
        zoomControlOptions: {
          position: 'right:bottom'
        }
      }
    });

    widget.init({
      helper: helper,
      instantSearchInstance: instantSearchInstance,
      state: helper.state
    });

    expect(googleReference.maps.Map).toHaveBeenCalledWith(expect.anything(), {
      otherMapSpecific: 'value',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      clickableIcons: true,
      zoomControlOptions: {
        position: 'right:bottom'
      }
    });
  });

  describe('setup events', function () {
    it('expect to listen for "idle" once and trigger the registration of the rest of the listeners', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      expect(googleReference.maps.event.addListenerOnce).toHaveBeenCalledWith(mapInstance, 'idle', expect.any(Function));

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('center_changed', expect.any(Function));

      expect(mapInstance.addListener).toHaveBeenCalledWith('zoom_changed', expect.any(Function));

      expect(mapInstance.addListener).toHaveBeenCalledWith('dragstart', expect.any(Function));

      expect(mapInstance.addListener).toHaveBeenCalledWith('idle', expect.any(Function));
    });

    it('expect to listen for "center_changed" and trigger setMapMoveSinceLastRefine on user interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('center_changed', expect.any(Function));

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);

      simulateEvent(mapInstance, 'center_changed');

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(true);
    });

    it('expect to listen for "center_changed" and do not trigger on programmatic interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('center_changed', expect.any(Function));

      // Simulate programmatic event
      lastRenderState(_GeoSearchRenderer2.default).isUserInteraction = false;

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);

      simulateEvent(mapInstance, 'center_changed');

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);
    });

    it('expect to listen for "zoom_changed", trigger setMapMoveSinceLastRefine and schedule a refine call on user interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('zoom_changed', expect.any(Function));

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);

      simulateEvent(mapInstance, 'zoom_changed');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(true);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(true);
    });

    it('expect to listen for "zoom_changed" and do not trigger on programmatic interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('zoom_changed', expect.any(Function));

      // Simulate programmatic event
      lastRenderState(_GeoSearchRenderer2.default).isUserInteraction = false;

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);

      simulateEvent(mapInstance, 'zoom_changed');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);
    });

    it('expect to listen for "dragstart" and schedule a refine call on user interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('dragstart', expect.any(Function));

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);

      simulateEvent(mapInstance, 'dragstart');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(true);
    });

    it('expect to listen for "dragstart" and do not trigger on programmatic interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('dragstart', expect.any(Function));

      // Simulate programmatic event
      lastRenderState(_GeoSearchRenderer2.default).isUserInteraction = false;

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);

      simulateEvent(mapInstance, 'dragstart');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
    });

    it('expect to listen for "idle", call refine and reset the scheduler', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      // Not the best way to check that refine has been called but I didn't
      // find an other way to do it. But it works.
      helper.search = jest.fn();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('idle', expect.any(Function));

      simulateEvent(mapInstance, 'dragstart');
      simulateEvent(mapInstance, 'idle');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
      expect(helper.search).toHaveBeenCalled();
    });

    it('expect to listen for "idle" and do not trigger on programmatic interaction', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      // Not the best way to check that refine has been called but I didn't
      // find an other way to do it. But it works.
      helper.search = jest.fn();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('idle', expect.any(Function));

      simulateEvent(mapInstance, 'dragstart');

      // Simulate programmatic event
      lastRenderState(_GeoSearchRenderer2.default).isUserInteraction = false;

      simulateEvent(mapInstance, 'idle');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(true);
      expect(helper.search).not.toHaveBeenCalled();
    });

    it('expect to listen for "idle" and do not trigger when refine is not schedule', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      // Not the best way to check that refine has been called but I didn't
      // find an other way to do it. But it works.
      helper.search = jest.fn();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('idle', expect.any(Function));

      simulateEvent(mapInstance, 'idle');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(false);
      expect(helper.search).not.toHaveBeenCalled();
    });

    it('expect to listen for "idle" and do not trigger when refine on map move is disabled', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      // Not the best way to check that refine has been called but I didn't
      // find an other way to do it. But it works.
      helper.search = jest.fn();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        enableRefineOnMapMove: false
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.addListener).toHaveBeenCalledWith('idle', expect.any(Function));

      simulateEvent(mapInstance, 'dragstart');
      simulateEvent(mapInstance, 'idle');

      expect(lastRenderState(_GeoSearchRenderer2.default).isPendingRefine).toBe(true);
      expect(helper.search).not.toHaveBeenCalled();
    });
  });

  describe('initial position', function () {
    it('expect to init the position from "initialPosition" when no items are available & map is not yet render', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        initialZoom: 8,
        initialPosition: {
          lat: 10,
          lng: 12
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(mapInstance.setCenter).toHaveBeenCalledWith({ lat: 10, lng: 12 });
      expect(mapInstance.setZoom).toHaveBeenCalledWith(8);
    });

    it('expect to init the position from "position" when no items are available & map is not yet render', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        initialZoom: 8,
        position: {
          lat: 12,
          lng: 14
        },
        initialPosition: {
          lat: 10,
          lng: 12
        }
      });

      // Simulate the configuration
      var initialState = widget.getConfiguration({});
      helper.setState(initialState);

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(mapInstance.setCenter).toHaveBeenCalledWith({ lat: 12, lng: 14 });
      expect(mapInstance.setZoom).toHaveBeenCalledWith(8);
    });

    it('expect to not init the position when items are available', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        initialZoom: 8,
        initialPosition: {
          lat: 10,
          lng: 12
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();
    });

    it('expect to not init the position when the refinement is coming from the map', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        initialZoom: 8,
        initialPosition: {
          lat: 10,
          lng: 12
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      // Simulate a refinement
      simulateEvent(mapInstance, 'dragstart');
      simulateEvent(mapInstance, 'center_changed');
      simulateEvent(mapInstance, 'idle');

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(mapInstance.setCenter).not.toHaveBeenCalled();
      expect(mapInstance.setZoom).not.toHaveBeenCalled();
    });
  });

  describe('markers creation', function () {
    it('expect to render built-in markers with default options', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var googleReference = createFakeGoogleReference();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      expect(googleReference.maps.Marker).toHaveBeenCalledTimes(3);
      expect(googleReference.maps.Marker.mock.calls).toEqual([[expect.objectContaining({ __id: 123 })], [expect.objectContaining({ __id: 456 })], [expect.objectContaining({ __id: 789 })]]);
    });

    it('expect to render built-in markers with given options', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var googleReference = createFakeGoogleReference();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        builtInMarker: {
          createOptions: function createOptions(item) {
            return {
              title: 'ID: ' + item.objectID
            };
          }
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      expect(googleReference.maps.Marker).toHaveBeenCalledTimes(3);
      expect(googleReference.maps.Marker.mock.calls).toEqual([[expect.objectContaining({ __id: 123, title: 'ID: 123' })], [expect.objectContaining({ __id: 456, title: 'ID: 456' })], [expect.objectContaining({ __id: 789, title: 'ID: 789' })]]);
    });

    it('expect to setup listeners on built-in markers', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var markerInstance = createFakeMarkerInstance();
      var googleReference = createFakeGoogleReference({
        mapInstance: mapInstance,
        markerInstance: markerInstance
      });

      var onClick = jest.fn();
      var onMouseOver = jest.fn();

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        builtInMarker: {
          events: {
            click: onClick,
            mouseover: onMouseOver
          }
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 234, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      // 2 events for each hit
      expect(markerInstance.addListener).toHaveBeenCalledTimes(6);

      // Simulate click event
      simulateEvent(markerInstance, 'click', { type: 'click' });

      // Simulate mouseover event
      simulateEvent(markerInstance, 'mouseover', { type: 'mouseover' });

      expect(onClick).toHaveBeenCalledWith({
        event: { type: 'click' },
        item: { objectID: 123, _geoloc: true },
        marker: expect.objectContaining({ __id: 123 }),
        map: mapInstance
      });

      expect(onMouseOver).toHaveBeenCalledWith({
        event: { type: 'mouseover' },
        item: { objectID: 123, _geoloc: true },
        marker: expect.objectContaining({ __id: 123 }),
        map: mapInstance
      });
    });

    it('expect to render custom HTML markers with default options', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = jest.fn(createFakeMarkerInstance);

      _createHTMLMarker2.default.mockImplementation(function () {
        return HTMLMarker;
      });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        customHTMLMarker: true
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      expect(HTMLMarker).toHaveBeenCalledTimes(3);
      expect(HTMLMarker.mock.calls).toEqual([[expect.objectContaining({
        __id: 123,
        template: '<p>Your custom HTML Marker</p>'
      })], [expect.objectContaining({
        __id: 456,
        template: '<p>Your custom HTML Marker</p>'
      })], [expect.objectContaining({
        __id: 789,
        template: '<p>Your custom HTML Marker</p>'
      })]]);

      _createHTMLMarker2.default.mockRestore();
    });

    it('expect to render custom HTML markers with given options', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = jest.fn(createFakeMarkerInstance);

      _createHTMLMarker2.default.mockImplementation(function () {
        return HTMLMarker;
      });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        customHTMLMarker: {
          createOptions: function createOptions(item) {
            return {
              title: 'ID: ' + item.objectID
            };
          },
          template: '<p>{{objectID}}</p>'
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      expect(HTMLMarker).toHaveBeenCalledTimes(3);
      expect(HTMLMarker.mock.calls).toEqual([[expect.objectContaining({
        __id: 123,
        title: 'ID: 123',
        template: '<p>123</p>'
      })], [expect.objectContaining({
        __id: 456,
        title: 'ID: 456',
        template: '<p>456</p>'
      })], [expect.objectContaining({
        __id: 789,
        title: 'ID: 789',
        template: '<p>789</p>'
      })]]);

      _createHTMLMarker2.default.mockRestore();
    });

    it('expect to setup listeners on custom HTML markers', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });
      var markerInstance = createFakeMarkerInstance();
      var HTMLMarker = jest.fn(function (_ref2) {
        var args = _objectWithoutProperties(_ref2, []);

        return _extends({}, args, markerInstance);
      });

      var onClick = jest.fn();
      var onMouseOver = jest.fn();

      _createHTMLMarker2.default.mockImplementation(function () {
        return HTMLMarker;
      });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container,
        customHTMLMarker: {
          events: {
            click: onClick,
            mouseover: onMouseOver
          }
        }
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 234, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      // 2 events for each hit
      expect(markerInstance.addListener).toHaveBeenCalledTimes(6);

      // Simulate click event
      simulateEvent(markerInstance, 'click', { type: 'click' });

      // Simulate mouseover event
      simulateEvent(markerInstance, 'mouseover', { type: 'mouseover' });

      expect(onClick).toHaveBeenCalledWith({
        event: { type: 'click' },
        item: { objectID: 123, _geoloc: true },
        marker: expect.objectContaining({ __id: 123 }),
        map: mapInstance
      });

      expect(onMouseOver).toHaveBeenCalledWith({
        event: { type: 'mouseover' },
        item: { objectID: 123, _geoloc: true },
        marker: expect.objectContaining({ __id: 123 }),
        map: mapInstance
      });

      _createHTMLMarker2.default.mockRestore();
    });
  });

  describe('markers lifecycle', function () {
    it('expect to append all new markers on the map', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var markerInstance = createFakeMarkerInstance();
      var googleReference = createFakeGoogleReference({ markerInstance: markerInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      expect(markerInstance.setMap).not.toHaveBeenCalled();
      expect(googleReference.maps.Marker).toHaveBeenCalledTimes(3);
      expect(lastRenderState(_GeoSearchRenderer2.default).markers).toEqual(expect.arrayContaining([expect.objectContaining({ __id: 123 }), expect.objectContaining({ __id: 456 }), expect.objectContaining({ __id: 789 })]));
    });

    it('expect to not append anything when the items are empty', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var markerInstance = createFakeMarkerInstance();
      var googleReference = createFakeGoogleReference({ markerInstance: markerInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(markerInstance.setMap).not.toHaveBeenCalled();
      expect(googleReference.maps.Marker).toHaveBeenCalledTimes(0);
      expect(lastRenderState(_GeoSearchRenderer2.default).markers).toEqual([]);
    });

    it('expect to append only new markers on the map on the next render', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var markerInstance = createFakeMarkerInstance();
      var googleReference = createFakeGoogleReference({ markerInstance: markerInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      googleReference.maps.Marker.mockClear();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }, { objectID: 101, _geoloc: true }]
        }
      });

      expect(markerInstance.setMap).not.toHaveBeenCalled();
      expect(googleReference.maps.Marker).toHaveBeenCalledTimes(1);
      expect(lastRenderState(_GeoSearchRenderer2.default).markers).toEqual(expect.arrayContaining([expect.objectContaining({ __id: 123 }), expect.objectContaining({ __id: 456 }), expect.objectContaining({ __id: 789 }), expect.objectContaining({ __id: 101 })]));
    });

    it('expect to remove only old markers on the map on the next render', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var markerInstance = createFakeMarkerInstance();
      var googleReference = createFakeGoogleReference({ markerInstance: markerInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }, { objectID: 789, _geoloc: true }]
        }
      });

      googleReference.maps.Marker.mockClear();

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(googleReference.maps.Marker).not.toHaveBeenCalled();
      expect(markerInstance.setMap).toHaveBeenCalledTimes(2);
      expect(lastRenderState(_GeoSearchRenderer2.default).markers).toEqual(expect.arrayContaining([expect.objectContaining({ __id: 123 })]));
    });
  });

  describe('fit markers position', function () {
    it('expect to set the position', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(2);

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }]
        }
      });

      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(2);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(3);
    });

    it("expect to set the position when it's refine with the map and the map is not render", function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      // Simulate external setter or URLSync
      helper.setQueryParameter('insideBoundingBox', [[48.84174222399724, 2.367719162523599, 48.81614630305218, 2.284205902635904]]);

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      // Simulate map setter
      mapInstance.getZoom.mockImplementation(function () {
        return 12;
      });
      mapInstance.getCenter.mockImplementation(function () {
        return {
          lat: 10,
          lng: 12
        };
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).isRefinedWithMap()).toBe(true);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(2);

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }, { objectID: 456, _geoloc: true }]
        }
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).isRefinedWithMap()).toBe(true);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(3);
    });

    it('expect to not set the position when there is no markers', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(2);

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: []
        }
      });

      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(3);
    });

    it('expect to not set the position when the map has move since last refine', function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(2);

      simulateEvent(mapInstance, 'center_changed');

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(true);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(3);
    });

    it("expect to not set the position when it's refine with the map and the map is already render", function () {
      var container = createContainer();
      var instantSearchInstance = createFakeInstantSearch();
      var helper = createFakeHelper();
      var mapInstance = createFakeMapInstance();
      var googleReference = createFakeGoogleReference({ mapInstance: mapInstance });

      var widget = (0, _geoSearch2.default)({
        googleReference: googleReference,
        container: container
      });

      widget.init({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        state: helper.state
      });

      simulateMapReadyEvent(googleReference);

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      // Simulate map setter
      mapInstance.getZoom.mockImplementation(function () {
        return 12;
      });
      mapInstance.getCenter.mockImplementation(function () {
        return {
          lat: 10,
          lng: 12
        };
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).isRefinedWithMap()).toBe(false);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(2);

      simulateEvent(mapInstance, 'dragstart');
      simulateEvent(mapInstance, 'center_changed');

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(true);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).isRefinedWithMap()).toBe(false);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(3);

      simulateEvent(mapInstance, 'idle');

      widget.render({
        helper: helper,
        instantSearchInstance: instantSearchInstance,
        results: {
          hits: [{ objectID: 123, _geoloc: true }]
        }
      });

      expect(lastRenderArgs(_GeoSearchRenderer2.default).hasMapMoveSinceLastRefine()).toBe(false);
      expect(lastRenderArgs(_GeoSearchRenderer2.default).isRefinedWithMap()).toBe(true);
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
      expect(_GeoSearchRenderer2.default).toHaveBeenCalledTimes(4);
    });
  });
});