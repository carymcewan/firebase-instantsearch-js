'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _utils = require('../../lib/utils');

var _connectGeoSearch = require('../../connectors/geo-search/connectGeoSearch');

var _connectGeoSearch2 = _interopRequireDefault(_connectGeoSearch);

var _GeoSearchRenderer = require('./GeoSearchRenderer');

var _GeoSearchRenderer2 = _interopRequireDefault(_GeoSearchRenderer);

var _defaultTemplates = require('./defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _createHTMLMarker = require('./createHTMLMarker');

var _createHTMLMarker2 = _interopRequireDefault(_createHTMLMarker);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

var bem = (0, _utils.bemHelper)('ais-geo-search');

var usage = 'Usage:\n\ngeoSearch({\n  container,\n  googleReference,\n  [ initialZoom = 1 ],\n  [ initialPosition = { lat: 0, lng: 0 } ],\n  [ paddingBoundingBox = { top: 0, right: 0, bottom: 0, right: 0 } ],\n  [ cssClasses.{root,map,controls,clear,control,toggleLabel,toggleLabelActive,toggleInput,redo} = {} ],\n  [ templates.{clear,toggle,redo} ],\n  [ mapOptions ],\n  [ builtInMarker ],\n  [ customHTMLMarker = false ],\n  [ enableClearMapRefinement = true ],\n  [ enableRefineControl = true ],\n  [ enableRefineOnMapMove = true ],\n  [ enableGeolocationWithIP = true ],\n  [ position ],\n  [ radius ],\n  [ precision ],\n})\n\nFull documentation available at https://community.algolia.com/instantsearch.js/v2/widgets/geoSearch.html\n';

/**
 * @typedef {object} HTMLMarkerOptions
 * @property {object} [anchor] The offset from the marker's position.
 */

/**
 * @typedef {object} CustomHTMLMarkerOptions
 * @property {string|function(item): string} template Template to use for the marker.
 * @property {function(item): HTMLMarkerOptions} [createOptions] Function used to create the options passed to the HTMLMarker.
 * @property {{ eventType: function(object) }} [events] Object that takes an event type (ex: `click`, `mouseover`) as key and a listener as value. The listener is provided with an object that contains `event`, `item`, `marker`, `map`.
 */

/**
 * @typedef {object} BuiltInMarkerOptions
 * @property {function(item): MarkerOptions} [createOptions] Function used to create the options passed to the Google Maps marker. <br />
 * See [the documentation](https://developers.google.com/maps/documentation/javascript/reference/3/#MarkerOptions) for more information.
 * @property {{ eventType: function(object) }} [events] Object that takes an event type (ex: `click`, `mouseover`) as key and a listener as value. The listener is provided with an object that contains `event`, `item`, `marker`, `map`.
 */

/**
 * @typedef {object} GeoSeachCSSClasses
 * @property {string|Array<string>} [root] CSS class to add to the root element.
 * @property {string|Array<string>} [map] CSS class to add to the map element.
 * @property {string|Array<string>} [controls] CSS class to add to the controls element.
 * @property {string|Array<string>} [clear] CSS class to add to the clear element.
 * @property {string|Array<string>} [control] CSS class to add to the control element.
 * @property {string|Array<string>} [toggleLabel] CSS class to add to the toggle label.
 * @property {string|Array<string>} [toggleLabelActive] CSS class to add to toggle label when it's active.
 * @property {string|Array<string>} [toggleInput] CSS class to add to the toggle input.
 * @property {string|Array<string>} [redo] CSS class to add to the redo element.
 */

/**
 * @typedef {object} GeoSearchTemplates
 * @property {string|function(object): string} [clear] Template for the clear button.
 * @property {string|function(object): string} [toggle] Template for the toggle label.
 * @property {string|function(object): string} [redo] Template for the redo button.
 */

/**
 * @typedef {object} Padding
 * @property {number} top The top padding in pixels.
 * @property {number} right The right padding in pixels.
 * @property {number} bottom The bottom padding in pixels.
 * @property {number} left The left padding in pixels.
 */

/**
 * @typedef {object} LatLng
 * @property {number} lat The latitude in degrees.
 * @property {number} lng The longitude in degrees.
 */

/**
 * @typedef {object} GeoSearchWidgetOptions
 * @property {string|HTMLElement} container CSS Selector or HTMLElement to insert the widget.
 * @property {object} googleReference Reference to the global `window.google` object. <br />
 * See [the documentation](https://developers.google.com/maps/documentation/javascript/tutorial) for more information.
 * @property {number} [initialZoom=1] By default the map will set the zoom accordingly to the markers displayed on it. When we refine it may happen that the results are empty. For those situtations we need to provide a zoom to render the map.
 * @property {LatLng} [initialPosition={ lat: 0, lng: 0 }] By default the map will set the position accordingly to the markers displayed on it. When we refine it may happen that the results are empty. For those situtations we need to provide a position to render the map. This option is ignored when the `position` is provided.
 * @property {Padding} [paddingBoundingBox={ top:0, right: 0, bottom:0, left: 0 }] Add an inner padding on the map when you refine.
 * @property {GeoSearchTemplates} [templates] Templates to use for the widget.
 * @property {GeoSeachCSSClasses} [cssClasses] CSS classes to add to the wrapping elements.
 * @property {object} [mapOptions] Option forwarded to the Google Maps constructor. <br />
 * See [the documentation](https://developers.google.com/maps/documentation/javascript/reference/3/#MapOptions) for more information.
 * @property {BuiltInMarkerOptions} [builtInMarker] Options for customize the built-in Google Maps marker. This option is ignored when the `customHTMLMarker` is provided.
 * @property {CustomHTMLMarkerOptions|boolean} [customHTMLMarker=false] Options for customize the HTML marker. We provide an alternative to the built-in Google Maps marker in order to have a full control of the marker rendering. You can use plain HTML to build your marker.
 * @property {boolean} [enableClearMapRefinement=true] If true, a button is displayed on the map when the refinement is coming from the map in order to remove it.
 * @property {boolean} [enableRefineControl=true] If true, the user can toggle the option `enableRefineOnMapMove` directly from the map.
 * @property {boolean} [enableRefineOnMapMove=true] If true, refine will be triggered as you move the map.
 * @property {boolean} [enableGeolocationWithIP=true] If true, the IP will be use for the geolocation. If the `position` option is provided this option will be ignored, since we already refine the results around the given position. See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundLatLngViaIP) for more information.
 * @property {LatLng} [position] Position that will be use to search around. <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundLatLng) for more information.
 * @property {number} [radius] Maximum radius to search around the position (in meters). <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundRadius) for more information.
 * @property {number} [precision] Precision of geo search (in meters). <br />
 * See [the documentation](https://www.algolia.com/doc/api-reference/api-parameters/aroundPrecision) for more information.
 */

/**
 * The **GeoSearch** widget displays the list of results from the search on a Google Maps. It also provides a way to search for results based on their position. The widget also provide some of the common GeoSearch patterns like search on map interaction.
 *
 * @requirements
 *
 * Note that the GeoSearch widget uses the [geosearch](https://www.algolia.com/doc/guides/searching/geo-search) capabilities of Algolia. Your hits **must** have a `_geoloc` attribute in order to be displayed on the map.
 *
 * You are also repsonsible for loading the Google Maps library, it's not shipped with InstantSearch. You need to load the Google Maps library and pass a reference to the widget. You can find more information about how to install the library in [the Google Maps documentation](https://developers.google.com/maps/documentation/javascript/tutorial).
 *
 * @type {WidgetFactory}
 * @devNovel GeoSearch
 * @param {GeoSearchWidgetOptions} $0 Options of the GeoSearch widget.
 * @return {Widget} A new instance of GeoSearch widget.
 * @staticExample
 * search.addWidget(
 *   instantsearch.widgets.geoSearch({
 *     container: '#geo-search-container',
 *     googleReference: window.google,
 *   })
 * );
 */
var geoSearch = function geoSearch() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref$initialZoom = _ref.initialZoom,
      initialZoom = _ref$initialZoom === undefined ? 1 : _ref$initialZoom,
      _ref$initialPosition = _ref.initialPosition,
      initialPosition = _ref$initialPosition === undefined ? { lat: 0, lng: 0 } : _ref$initialPosition,
      _ref$templates = _ref.templates,
      userTemplates = _ref$templates === undefined ? {} : _ref$templates,
      _ref$cssClasses = _ref.cssClasses,
      userCssClasses = _ref$cssClasses === undefined ? {} : _ref$cssClasses,
      _ref$paddingBoundingB = _ref.paddingBoundingBox,
      userPaddingBoundingBox = _ref$paddingBoundingB === undefined ? {} : _ref$paddingBoundingB,
      _ref$builtInMarker = _ref.builtInMarker,
      userBuiltInMarker = _ref$builtInMarker === undefined ? {} : _ref$builtInMarker,
      _ref$customHTMLMarker = _ref.customHTMLMarker,
      userCustomHTMLMarker = _ref$customHTMLMarker === undefined ? false : _ref$customHTMLMarker,
      _ref$enableClearMapRe = _ref.enableClearMapRefinement,
      enableClearMapRefinement = _ref$enableClearMapRe === undefined ? true : _ref$enableClearMapRe,
      _ref$enableRefineCont = _ref.enableRefineControl,
      enableRefineControl = _ref$enableRefineCont === undefined ? true : _ref$enableRefineCont,
      container = _ref.container,
      googleReference = _ref.googleReference,
      widgetParams = _objectWithoutProperties(_ref, ['initialZoom', 'initialPosition', 'templates', 'cssClasses', 'paddingBoundingBox', 'builtInMarker', 'customHTMLMarker', 'enableClearMapRefinement', 'enableRefineControl', 'container', 'googleReference']);

  var defaultBuiltInMarker = {
    createOptions: _noop2.default,
    events: {}
  };

  var defaultCustomHTMLMarker = {
    template: '<p>Your custom HTML Marker</p>',
    createOptions: _noop2.default,
    events: {}
  };

  var defaultPaddingBoundingBox = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  if (!container) {
    throw new Error('Must provide a "container". ' + usage);
  }

  if (!googleReference) {
    throw new Error('Must provide a "googleReference". ' + usage);
  }

  var cssClasses = {
    root: (0, _classnames2.default)(bem(null), userCssClasses.root),
    map: (0, _classnames2.default)(bem('map'), userCssClasses.map),
    controls: (0, _classnames2.default)(bem('controls'), userCssClasses.controls),
    clear: (0, _classnames2.default)(bem('clear'), userCssClasses.clear),
    control: (0, _classnames2.default)(bem('control'), userCssClasses.control),
    toggleLabel: (0, _classnames2.default)(bem('toggle-label'), userCssClasses.toggleLabel),
    toggleLabelActive: (0, _classnames2.default)(bem('toggle-label-active'), userCssClasses.toggleLabelActive),
    toggleInput: (0, _classnames2.default)(bem('toggle-input'), userCssClasses.toggleInput),
    redo: (0, _classnames2.default)(bem('redo'), userCssClasses.redo)
  };

  var templates = _extends({}, _defaultTemplates2.default, userTemplates);

  var builtInMarker = _extends({}, defaultBuiltInMarker, userBuiltInMarker);

  var customHTMLMarker = Boolean(userCustomHTMLMarker) && _extends({}, defaultCustomHTMLMarker, userCustomHTMLMarker);

  var paddingBoundingBox = _extends({}, defaultPaddingBoundingBox, userPaddingBoundingBox);

  var createBuiltInMarker = function createBuiltInMarker(_ref2) {
    var item = _ref2.item,
        rest = _objectWithoutProperties(_ref2, ['item']);

    return new googleReference.maps.Marker(_extends({}, builtInMarker.createOptions(item), rest, {
      __id: item.objectID,
      position: item._geoloc
    }));
  };

  var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
  var createCustomHTMLMarker = function createCustomHTMLMarker(_ref3) {
    var item = _ref3.item,
        rest = _objectWithoutProperties(_ref3, ['item']);

    return new HTMLMarker(_extends({}, customHTMLMarker.createOptions(item), rest, {
      __id: item.objectID,
      position: item._geoloc,
      className: (0, _classnames2.default)(bem('marker')),
      template: (0, _utils.renderTemplate)({
        templateKey: 'template',
        templates: customHTMLMarker,
        data: item
      })
    }));
  };

  var createMarker = !customHTMLMarker ? createBuiltInMarker : createCustomHTMLMarker;

  // prettier-ignore
  var markerOptions = !customHTMLMarker ? builtInMarker : customHTMLMarker;

  try {
    var makeGeoSearch = (0, _connectGeoSearch2.default)(_GeoSearchRenderer2.default);

    return makeGeoSearch(_extends({}, widgetParams, {
      renderState: {},
      container: container,
      googleReference: googleReference,
      initialZoom: initialZoom,
      initialPosition: initialPosition,
      templates: templates,
      cssClasses: cssClasses,
      paddingBoundingBox: paddingBoundingBox,
      createMarker: createMarker,
      markerOptions: markerOptions,
      enableClearMapRefinement: enableClearMapRefinement,
      enableRefineControl: enableRefineControl
    }));
  } catch (e) {
    throw new Error('See usage. ' + usage);
  }
};

exports.default = geoSearch;