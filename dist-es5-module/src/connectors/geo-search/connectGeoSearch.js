'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _utils = require('../../lib/utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var usage = 'Usage:\n\nvar customGeoSearch = connectGeoSearch(function render(params, isFirstRendering) {\n  // params = {\n  //   items,\n  //   position,\n  //   refine,\n  //   clearMapRefinement,\n  //   isRefinedWithMap,\n  //   toggleRefineOnMapMove,\n  //   isRefineOnMapMove,\n  //   setMapMoveSinceLastRefine,\n  //   hasMapMoveSinceLastRefine,\n  //   hasMapMoveSinceLastRefine,\n  //   widgetParams,\n  //   instantSearchInstance,\n  // }\n});\n\nsearch.addWidget(\n  customGeoSearch({\n    [ enableRefineOnMapMove = true ],\n    [ enableGeolocationWithIP = true ],\n    [ position ],\n    [ radius ],\n    [ precision ],\n  })\n);\n\nFull documentation available at https://community.algolia.com/instantsearch.js/v2/connectors/connectGeoSearch.html\n';

/**
 * @typedef {Object} LatLng
 * @property {number} lat The latitude in degrees.
 * @property {number} lng The longitude in degrees.
 */

/**
 * @typedef {Object} Bounds
 * @property {LatLng} northEast The top right corner of the map view.
 * @property {LatLng} southWest The bottom left corner of the map view.
 */

/**
 * @typedef {Object} CustomGeoSearchWidgetOptions
 * @property {boolean} [enableRefineOnMapMove=true] If true, refine will be triggered as you move the map.
 * @property {boolean} [enableGeolocationWithIP=true] If true, the IP will be use for the geolocation. When the `position` option is provided this option will be ignored. See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundLatLngViaIP) for more informations.
 * @property {LatLng} [position] Position that will be use to search around. <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundLatLng) for more informations.
 * @property {number} [radius] Maximum radius to search around the position (in meters). <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundRadius) for more informations.
 * @property {number} [precision] Precision of geo search (in meters). <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundPrecision) for more informations.
 */

/**
 * @typedef {Object} GeoSearchRenderingOptions
 * @property {Object[]} items The matched hits from Algolia API.
 * @property {function(Bounds)} refine Sets a bounding box to filter the results from the given map bounds.
 * @property {function()} clearMapRefinement Reset the current bounding box refinement.
 * @property {function(): boolean} isRefinedWithMap Return true if the current refinement is set with the map bounds.
 * @property {function()} toggleRefineOnMapMove Toggle the fact that the user is able to refine on map move.
 * @property {function(): boolean} isRefineOnMapMove Return true if the user is able to refine on map move.
 * @property {function()} setMapMoveSinceLastRefine Set the fact that the map has moved since the last refinement, should be call on each map move. The call to the function triggers a new rendering only when the value change.
 * @property {function(): boolean} hasMapMoveSinceLastRefine Return true if the map has move since the last refinement.
 * @property {Object} widgetParams All original `CustomGeoSearchWidgetOptions` forwarded to the `renderFn`.
 * @property {LatLng} [position] The current position of the search.
 */

/**
 * The **GeoSearch** connector provides the logic to build a widget that will display the results on a map. It also provides a way to search for results based on their position. The connector provides functions to manage the search experience (search on map interaction or control the interaction for example).
 *
 * Note that the GeoSearch connector uses the [geosearch](https://www.algolia.com/doc/guides/searching/geo-search) capabilities of Algolia. Your hits **must** have a `_geoloc` attribute in order to be passed to the rendering function.
 *
 * @type {Connector}
 * @param {function(GeoSearchRenderingOptions, boolean)} renderFn Rendering function for the custom **GeoSearch** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomGeoSearchWidgetOptions)} Re-usable widget factory for a custom **GeoSearch** widget.
 * @staticExample
 * // This example use Leaflet for the rendering, be sure to have the library correctly setup
 * // before trying the demo. You can find more details in their documentation (link below).
 * // We choose Leaflet for the example but you can use any libraries that you want.
 * // See: http://leafletjs.com/examples/quick-start
 *
 * let map = null;
 * let markers = [];
 *
 * // custom `renderFn` to render the custom GeoSearch widget
 * function renderFn(GeoSearchRenderingOptions, isFirstRendering) {
 *   const { items, widgetParams } = GeoSearchRenderingOptions;
 *
 *   if (isFirstRendering) {
 *     map = L.map(widgetParams.container);
 *
 *     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 *       attribution:
 *         '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
 *     }).addTo(map);
 *   }
 *
 *   markers.forEach(marker => marker.remove());
 *
 *   markers = items.map(({ _geoloc }) =>
 *     L.marker([_geoloc.lat, _geoloc.lng]).addTo(map)
 *   );
 *
 *   if (markers.length) {
 *     map.fitBounds(L.featureGroup(markers).getBounds());
 *   }
 * }
 *
 * // connect `renderFn` to GeoSearch logic
 * const customGeoSearch = instantsearch.connectors.connectGeoSearch(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customGeoSearch({
 *     container: document.getElementById('custom-geo-search'),
 *   })
 * );
 */
var connectGeoSearch = function connectGeoSearch(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _widgetParams$enableR = widgetParams.enableRefineOnMapMove,
        enableRefineOnMapMove = _widgetParams$enableR === undefined ? true : _widgetParams$enableR,
        _widgetParams$enableG = widgetParams.enableGeolocationWithIP,
        enableGeolocationWithIP = _widgetParams$enableG === undefined ? true : _widgetParams$enableG,
        position = widgetParams.position,
        radius = widgetParams.radius,
        precision = widgetParams.precision;

    var widgetState = {
      isRefineOnMapMove: enableRefineOnMapMove,
      hasMapMoveSinceLastRefine: false,
      lastRefinePosition: '',
      lastRefineBoundingBox: '',
      internalToggleRefineOnMapMove: _noop2.default,
      internalSetMapMoveSinceLastRefine: _noop2.default
    };

    var getPositionFromState = function getPositionFromState(state) {
      return state.aroundLatLng && (0, _utils.parseAroundLatLngFromString)(state.aroundLatLng);
    };

    var refine = function refine(helper) {
      return function (_ref) {
        var ne = _ref.northEast,
            sw = _ref.southWest;

        var boundingBox = [ne.lat, ne.lng, sw.lat, sw.lng].join();

        helper.setQueryParameter('insideBoundingBox', boundingBox).search();

        widgetState.hasMapMoveSinceLastRefine = false;
        widgetState.lastRefineBoundingBox = boundingBox;
      };
    };

    var clearMapRefinement = function clearMapRefinement(helper) {
      return function () {
        helper.setQueryParameter('insideBoundingBox').search();
      };
    };

    var isRefinedWithMap = function isRefinedWithMap(state) {
      return function () {
        return Boolean(state.insideBoundingBox);
      };
    };

    var toggleRefineOnMapMove = function toggleRefineOnMapMove() {
      return widgetState.internalToggleRefineOnMapMove();
    };
    var createInternalToggleRefinementonMapMove = function createInternalToggleRefinementonMapMove(render, args) {
      return function () {
        widgetState.isRefineOnMapMove = !widgetState.isRefineOnMapMove;

        render(args);
      };
    };

    var isRefineOnMapMove = function isRefineOnMapMove() {
      return widgetState.isRefineOnMapMove;
    };

    var setMapMoveSinceLastRefine = function setMapMoveSinceLastRefine() {
      return widgetState.internalSetMapMoveSinceLastRefine();
    };
    var createInternalSetMapMoveSinceLastRefine = function createInternalSetMapMoveSinceLastRefine(render, args) {
      return function () {
        var shouldTriggerRender = widgetState.hasMapMoveSinceLastRefine !== true;

        widgetState.hasMapMoveSinceLastRefine = true;

        if (shouldTriggerRender) {
          render(args);
        }
      };
    };

    var hasMapMoveSinceLastRefine = function hasMapMoveSinceLastRefine() {
      return widgetState.hasMapMoveSinceLastRefine;
    };

    var init = function init(initArgs) {
      var state = initArgs.state,
          helper = initArgs.helper,
          instantSearchInstance = initArgs.instantSearchInstance;

      var isFirstRendering = true;

      widgetState.internalToggleRefineOnMapMove = createInternalToggleRefinementonMapMove(_noop2.default, initArgs);

      widgetState.internalSetMapMoveSinceLastRefine = createInternalSetMapMoveSinceLastRefine(_noop2.default, initArgs);

      renderFn({
        items: [],
        position: getPositionFromState(state),
        refine: refine(helper),
        clearMapRefinement: clearMapRefinement(helper),
        isRefinedWithMap: isRefinedWithMap(state),
        toggleRefineOnMapMove: toggleRefineOnMapMove,
        isRefineOnMapMove: isRefineOnMapMove,
        setMapMoveSinceLastRefine: setMapMoveSinceLastRefine,
        hasMapMoveSinceLastRefine: hasMapMoveSinceLastRefine,
        widgetParams: widgetParams,
        instantSearchInstance: instantSearchInstance
      }, isFirstRendering);
    };

    var render = function render(renderArgs) {
      var results = renderArgs.results,
          helper = renderArgs.helper,
          instantSearchInstance = renderArgs.instantSearchInstance;

      var isFirstRendering = false;
      // We don't use the state provided by the render function because we need
      // to be sure that the state is the latest one for the following condition
      var state = helper.getState();

      var positionChangedSinceLastRefine = Boolean(state.aroundLatLng) && Boolean(widgetState.lastRefinePosition) && state.aroundLatLng !== widgetState.lastRefinePosition;

      var boundingBoxChangedSinceLastRefine = !state.insideBoundingBox && Boolean(widgetState.lastRefineBoundingBox) && state.insideBoundingBox !== widgetState.lastRefineBoundingBox;

      if (positionChangedSinceLastRefine || boundingBoxChangedSinceLastRefine) {
        widgetState.hasMapMoveSinceLastRefine = false;
      }

      widgetState.lastRefinePosition = state.aroundLatLng || '';
      widgetState.lastRefineBoundingBox = state.insideBoundingBox || '';

      widgetState.internalToggleRefineOnMapMove = createInternalToggleRefinementonMapMove(render, renderArgs);

      widgetState.internalSetMapMoveSinceLastRefine = createInternalSetMapMoveSinceLastRefine(render, renderArgs);

      renderFn({
        items: results.hits.filter(function (hit) {
          return hit._geoloc;
        }),
        position: getPositionFromState(state),
        refine: refine(helper),
        clearMapRefinement: clearMapRefinement(helper),
        isRefinedWithMap: isRefinedWithMap(state),
        toggleRefineOnMapMove: toggleRefineOnMapMove,
        isRefineOnMapMove: isRefineOnMapMove,
        setMapMoveSinceLastRefine: setMapMoveSinceLastRefine,
        hasMapMoveSinceLastRefine: hasMapMoveSinceLastRefine,
        widgetParams: widgetParams,
        instantSearchInstance: instantSearchInstance
      }, isFirstRendering);
    };

    return {
      init: init,
      render: render,

      getConfiguration: function getConfiguration(previous) {
        var configuration = {};

        if (enableGeolocationWithIP && !position && !previous.aroundLatLng && previous.aroundLatLngViaIP === undefined) {
          configuration.aroundLatLngViaIP = true;
        }

        if (position && !previous.aroundLatLng && !previous.aroundLatLngViaIP) {
          configuration.aroundLatLng = position.lat + ', ' + position.lng;
        }

        if (radius && !previous.aroundRadius) {
          configuration.aroundRadius = radius;
        }

        if (precision && !previous.aroundPrecision) {
          configuration.aroundPrecision = precision;
        }

        return configuration;
      },
      dispose: function dispose(_ref2) {
        var state = _ref2.state;

        unmountFn();

        var nextState = state;

        if (enableGeolocationWithIP && !position) {
          nextState = state.setQueryParameter('aroundLatLngViaIP');
        }

        if (position) {
          nextState = state.setQueryParameter('aroundLatLng');
        }

        if (radius) {
          nextState = state.setQueryParameter('aroundRadius');
        }

        if (precision) {
          nextState = state.setQueryParameter('aroundPrecision');
        }

        return nextState;
      }
    };
  };
};

exports.default = connectGeoSearch;