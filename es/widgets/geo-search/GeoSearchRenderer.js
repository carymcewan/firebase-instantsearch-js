"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preactCompat = require("preact-compat");

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _utils = require("../../lib/utils");

var _GeoSearchControls = require("../../components/GeoSearchControls/GeoSearchControls");

var _GeoSearchControls2 = _interopRequireDefault(_GeoSearchControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var refineWithMap = function refineWithMap(_ref) {
  var refine = _ref.refine,
      paddingBoundingBox = _ref.paddingBoundingBox,
      mapInstance = _ref.mapInstance;

  // Function for compute the projection of LatLng to Point (pixel)
  // Builtin in Leaflet: myMapInstance.project(LatLng, zoom)
  // http://krasimirtsonev.com/blog/article/google-maps-api-v3-convert-latlng-object-to-actual-pixels-point-object
  // http://leafletjs.com/reference-1.2.0.html#map-project
  var scale = Math.pow(2, mapInstance.getZoom());

  var northEastPoint = mapInstance.getProjection().fromLatLngToPoint(mapInstance.getBounds().getNorthEast());

  northEastPoint.x = northEastPoint.x - paddingBoundingBox.right / scale;
  northEastPoint.y = northEastPoint.y + paddingBoundingBox.top / scale;

  var southWestPoint = mapInstance.getProjection().fromLatLngToPoint(mapInstance.getBounds().getSouthWest());

  southWestPoint.x = southWestPoint.x + paddingBoundingBox.right / scale;
  southWestPoint.y = southWestPoint.y - paddingBoundingBox.bottom / scale;

  var ne = mapInstance.getProjection().fromPointToLatLng(northEastPoint);
  var sw = mapInstance.getProjection().fromPointToLatLng(southWestPoint);

  refine({
    northEast: { lat: ne.lat(), lng: ne.lng() },
    southWest: { lat: sw.lat(), lng: sw.lng() }
  });
};

var collectMarkersForNextRender = function collectMarkersForNextRender(markers, nextIds) {
  return markers.reduce(function (_ref2, marker) {
    var _ref3 = _slicedToArray(_ref2, 2),
        update = _ref3[0],
        exit = _ref3[1];

    var persist = nextIds.includes(marker.__id);

    return persist ? [update.concat(marker), exit] : [update, exit.concat(marker)];
  }, [[], []]);
};

var renderer = function renderer(_ref4, isFirstRendering) {
  var items = _ref4.items,
      position = _ref4.position,
      refine = _ref4.refine,
      clearMapRefinement = _ref4.clearMapRefinement,
      toggleRefineOnMapMove = _ref4.toggleRefineOnMapMove,
      isRefineOnMapMove = _ref4.isRefineOnMapMove,
      setMapMoveSinceLastRefine = _ref4.setMapMoveSinceLastRefine,
      hasMapMoveSinceLastRefine = _ref4.hasMapMoveSinceLastRefine,
      isRefinedWithMap = _ref4.isRefinedWithMap,
      widgetParams = _ref4.widgetParams,
      instantSearchInstance = _ref4.instantSearchInstance;
  var container = widgetParams.container,
      googleReference = widgetParams.googleReference,
      cssClasses = widgetParams.cssClasses,
      templates = widgetParams.templates,
      initialZoom = widgetParams.initialZoom,
      initialPosition = widgetParams.initialPosition,
      enableClearMapRefinement = widgetParams.enableClearMapRefinement,
      enableRefineControl = widgetParams.enableRefineControl,
      paddingBoundingBox = widgetParams.paddingBoundingBox,
      mapOptions = widgetParams.mapOptions,
      createMarker = widgetParams.createMarker,
      markerOptions = widgetParams.markerOptions,
      renderState = widgetParams.renderState;

  var containerNode = (0, _utils.getContainerNode)(container);

  if (isFirstRendering) {
    renderState.isUserInteraction = true;
    renderState.isPendingRefine = false;
    renderState.markers = [];

    var rootElement = document.createElement('div');
    rootElement.className = cssClasses.root;
    containerNode.appendChild(rootElement);

    var mapElement = document.createElement('div');
    mapElement.className = cssClasses.map;
    rootElement.appendChild(mapElement);

    var controlElement = document.createElement('div');
    controlElement.className = cssClasses.controls;
    rootElement.appendChild(controlElement);

    renderState.mapInstance = new googleReference.maps.Map(mapElement, _extends({
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      clickableIcons: false,
      zoomControlOptions: {
        position: googleReference.maps.ControlPosition.LEFT_TOP
      }
    }, mapOptions));

    var setupListenersWhenMapIsReady = function setupListenersWhenMapIsReady() {
      renderState.mapInstance.addListener('center_changed', function () {
        if (renderState.isUserInteraction) {
          setMapMoveSinceLastRefine();
        }
      });

      renderState.mapInstance.addListener('zoom_changed', function () {
        if (renderState.isUserInteraction) {
          renderState.isPendingRefine = true;
          setMapMoveSinceLastRefine();
        }
      });

      renderState.mapInstance.addListener('dragstart', function () {
        if (renderState.isUserInteraction) {
          renderState.isPendingRefine = true;
        }
      });

      renderState.mapInstance.addListener('idle', function () {
        if (renderState.isUserInteraction && renderState.isPendingRefine && isRefineOnMapMove()) {
          renderState.isPendingRefine = false;

          refineWithMap({
            mapInstance: renderState.mapInstance,
            refine: refine,
            paddingBoundingBox: paddingBoundingBox
          });
        }
      });
    };

    googleReference.maps.event.addListenerOnce(renderState.mapInstance, 'idle', setupListenersWhenMapIsReady);

    renderState.templateProps = (0, _utils.prepareTemplateProps)({
      templatesConfig: instantSearchInstance.templatesConfig,
      templates: templates
    });

    return;
  }

  if (!items.length && !isRefinedWithMap()) {
    var intialMapPosition = position || initialPosition;

    renderState.isUserInteraction = false;
    renderState.mapInstance.setCenter(intialMapPosition);
    renderState.mapInstance.setZoom(initialZoom);
    renderState.isUserInteraction = true;
  }

  // Collect markers that need to be updated or removed
  var nextItemsIds = items.map(function (_) {
    return _.objectID;
  });

  var _collectMarkersForNex = collectMarkersForNextRender(renderState.markers, nextItemsIds),
      _collectMarkersForNex2 = _slicedToArray(_collectMarkersForNex, 2),
      updateMarkers = _collectMarkersForNex2[0],
      exitMarkers = _collectMarkersForNex2[1];

  // Collect items that will be added


  var updateMarkerIds = updateMarkers.map(function (_) {
    return _.__id;
  });
  var nextPendingItems = items.filter(function (item) {
    return !updateMarkerIds.includes(item.objectID);
  });

  // Remove all markers that need to be removed
  exitMarkers.forEach(function (marker) {
    return marker.setMap(null);
  });

  // Create the markers from the items
  renderState.markers = updateMarkers.concat(nextPendingItems.map(function (item) {
    var marker = createMarker({
      map: renderState.mapInstance,
      item: item
    });

    Object.keys(markerOptions.events).forEach(function (eventName) {
      marker.addListener(eventName, function (event) {
        markerOptions.events[eventName]({
          map: renderState.mapInstance,
          event: event,
          item: item,
          marker: marker
        });
      });
    });

    return marker;
  }));

  // Fit the map to the markers when needed
  var hasMarkers = renderState.markers.length;
  var center = renderState.mapInstance.getCenter();
  var zoom = renderState.mapInstance.getZoom();
  var isPositionInitialize = center !== undefined && zoom !== undefined;
  var enableFitBounds = !hasMapMoveSinceLastRefine() && (!isRefinedWithMap() || isRefinedWithMap() && !isPositionInitialize);

  if (hasMarkers && enableFitBounds) {
    var bounds = renderState.markers.reduce(function (acc, marker) {
      return acc.extend(marker.getPosition());
    }, new googleReference.maps.LatLngBounds());

    renderState.isUserInteraction = false;
    renderState.mapInstance.fitBounds(bounds);
    renderState.isUserInteraction = true;
  }

  (0, _preactCompat.render)(_preactCompat2.default.createElement(_GeoSearchControls2.default, {
    cssClasses: cssClasses,
    enableRefineControl: enableRefineControl,
    enableClearMapRefinement: enableClearMapRefinement,
    isRefineOnMapMove: isRefineOnMapMove(),
    isRefinedWithMap: isRefinedWithMap(),
    hasMapMoveSinceLastRefine: hasMapMoveSinceLastRefine(),
    onRefineToggle: toggleRefineOnMapMove,
    onRefineClick: function onRefineClick() {
      return refineWithMap({
        mapInstance: renderState.mapInstance,
        refine: refine,
        paddingBoundingBox: paddingBoundingBox
      });
    },
    onClearClick: clearMapRefinement,
    templateProps: renderState.templateProps
  }), containerNode.querySelector('.' + cssClasses.controls));
};

exports.default = renderer;