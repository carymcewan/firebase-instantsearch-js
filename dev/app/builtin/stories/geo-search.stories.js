'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable import/default */

var _devNovel = require('dev-novel');

var _instantsearchWidget = require('places.js/instantsearchWidget');

var _instantsearchWidget2 = _interopRequireDefault(_instantsearchWidget);

var _scriptjs = require('scriptjs');

var _scriptjs2 = _interopRequireDefault(_scriptjs);

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits');

var _createInfoBox = require('../../utils/create-info-box');

var _createInfoBox2 = _interopRequireDefault(_createInfoBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapWithHitsAndConfiguration = function wrapWithHitsAndConfiguration(story, searchParameters) {
  return (0, _wrapWithHits.wrapWithHits)(story, {
    indexName: 'airbnb',
    searchParameters: _extends({
      hitsPerPage: 25
    }, searchParameters)
  });
};

var injectGoogleMaps = function injectGoogleMaps(fn) {
  (0, _scriptjs2.default)('https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8', fn);
};

exports.default = function () {
  var Stories = (0, _devNovel.storiesOf)('GeoSearch');
  var radius = 5000;
  var precision = 2500;
  var initialZoom = 12;

  var position = {
    lat: 37.7793,
    lng: -122.419
  };

  var initialPosition = {
    lat: 40.71,
    lng: -74.01
  };

  var paddingBoundingBox = {
    top: 41,
    right: 13,
    bottom: 5,
    left: 13
  };

  Stories.add('default', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container
      }));

      start();
    });
  }));

  // With IP
  Stories.add('with IP', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with IP & radius', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        radius: radius
      }));

      start();
    });
  })).add('with IP & radius & precision', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        radius: radius,
        precision: precision
      }));

      start();
    });
  }));

  // With position
  Stories.add('with position', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        position: position
      }));

      start();
    });
  })).add('with position & radius', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        radius: radius,
        position: position
      }));

      start();
    });
  })).add('with position & radius & precision', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        radius: radius,
        precision: precision,
        position: position
      }));

      start();
    });
  }));

  // With Places
  Stories.add('with position from Places', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var placesElemeent = document.createElement('input');
      var mapElement = document.createElement('div');
      mapElement.style.height = '500px';
      mapElement.style.marginTop = '20px';

      container.appendChild(placesElemeent);
      container.appendChild(mapElement);

      window.search.addWidget((0, _instantsearchWidget2.default)({
        container: placesElemeent,
        defaultPosition: [position.lat, position.lng]
      }));

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: mapElement,
        radius: 20000,
        enableGeolocationWithIP: false,
        enableClearMapRefinement: false,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  }));

  // Only UI
  Stories.add('with control & refine on map move', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox,
        enableRefineControl: true,
        enableRefineOnMapMove: true
      }));

      start();
    });
  })).add('with control & disable refine on map move', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        enableRefineControl: true,
        enableRefineOnMapMove: false,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('without control & refine on map move', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        enableRefineControl: false,
        enableRefineOnMapMove: true,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('without control & disable refine on map move', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        enableRefineControl: false,
        enableRefineOnMapMove: false,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with custom templates for controls', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        templates: {
          clear: '<span>re-center</span>',
          toggle: '<span>Redo search when map moved</span>',
          redo: '<span>Search this area</span>'
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with custom map options', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        mapOptions: {
          streetViewControl: true
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with built-in marker options', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var logger = (0, _devNovel.action)('[GeoSearch] click: builtInMarker');

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        builtInMarker: {
          createOptions: function createOptions(item) {
            return {
              title: item.name,
              label: item.price_formatted
            };
          },
          events: {
            click: function click(_ref) {
              var event = _ref.event,
                  item = _ref.item,
                  marker = _ref.marker,
                  map = _ref.map;

              logger(event, item, marker, map);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with built-in marker & InfoWindow', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var InfoWindow = new window.google.maps.InfoWindow();

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        builtInMarker: {
          events: {
            click: function click(_ref2) {
              var item = _ref2.item,
                  marker = _ref2.marker,
                  map = _ref2.map;

              if (InfoWindow.getMap()) {
                InfoWindow.close();
              }

              InfoWindow.setContent(item.name);

              InfoWindow.open(map, marker);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with built-in marker & InfoBox', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var InfoBox = (0, _createInfoBox2.default)(window.google);
      var InfoBoxInstance = new InfoBox();

      InfoBoxInstance.addListener('domready', function () {
        var bbBox = InfoBoxInstance.div_.getBoundingClientRect();

        InfoBoxInstance.setOptions({
          pixelOffset: new window.google.maps.Size(-bbBox.width / 2, -bbBox.height - 35 // Adjust with the marker size
          )
        });
      });

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        builtInMarker: {
          events: {
            click: function click(_ref3) {
              var item = _ref3.item,
                  marker = _ref3.marker,
                  map = _ref3.map;

              if (InfoBoxInstance.getMap()) {
                InfoBoxInstance.close();
              }

              InfoBoxInstance.setContent('\n                      <div class="my-custom-info-box">\n                        <p class="my-custom-info-box__text">' + item.name + '</p>\n                      </div>\n                    ');

              InfoBoxInstance.open(map, marker);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with HTML marker options', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var logger = (0, _devNovel.action)('[GeoSearch] click: HTMLMarker');

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        customHTMLMarker: {
          createOptions: function createOptions() {
            return {
              anchor: {
                x: 0,
                y: 5
              }
            };
          },
          template: '\n                  <div class="my-custom-marker">\n                    {{price_formatted}}\n                  </div>\n                ',
          events: {
            click: function click(_ref4) {
              var event = _ref4.event,
                  item = _ref4.item,
                  marker = _ref4.marker,
                  map = _ref4.map;

              logger(event, item, marker, map);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with HTML marker & InfoWindow', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var InfoWindow = new window.google.maps.InfoWindow({
        pixelOffset: new window.google.maps.Size(0, -30)
      });

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        customHTMLMarker: {
          createOptions: function createOptions() {
            return {
              anchor: {
                x: 0,
                y: 5
              }
            };
          },
          template: '\n                  <div class="my-custom-marker">\n                    {{price_formatted}}\n                  </div>\n                ',
          events: {
            click: function click(_ref5) {
              var item = _ref5.item,
                  marker = _ref5.marker,
                  map = _ref5.map;

              if (InfoWindow.getMap()) {
                InfoWindow.close();
              }

              InfoWindow.setContent(item.name);

              InfoWindow.open(map, marker);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with HTML marker & InfoBox', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var InfoBox = (0, _createInfoBox2.default)(window.google);
      var InfoBoxInstance = new InfoBox();

      InfoBoxInstance.addListener('domready', function () {
        var bbBox = InfoBoxInstance.div_.getBoundingClientRect();

        InfoBoxInstance.setOptions({
          pixelOffset: new window.google.maps.Size(-bbBox.width / 2, -bbBox.height - 5 // Adjust with the marker offset
          )
        });
      });

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        customHTMLMarker: {
          createOptions: function createOptions() {
            return {
              anchor: {
                x: 0,
                y: 5
              }
            };
          },
          template: '\n                  <div class="my-custom-marker">\n                    {{price_formatted}}\n                  </div>\n                ',
          events: {
            click: function click(_ref6) {
              var item = _ref6.item,
                  marker = _ref6.marker,
                  map = _ref6.map;

              if (InfoBoxInstance.getMap()) {
                InfoBoxInstance.close();
              }

              InfoBoxInstance.setContent('\n                      <div class="my-custom-info-box">\n                        <p class="my-custom-info-box__text">' + item.name + '</p>\n                      </div>\n                    ');

              InfoBoxInstance.open(map, marker);
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with Hits communication (custom)', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      var containerElement = document.querySelector('#results-hits-container');

      var removeActiveHitClassNames = function removeActiveHitClassNames() {
        document.querySelectorAll('.hit').forEach(function (el) {
          el.classList.remove('hit--active');
        });
      };

      var removeActiveMarkerClassNames = function removeActiveMarkerClassNames() {
        document.querySelectorAll('.my-custom-marker').forEach(function (el) {
          el.classList.remove('my-custom-marker--active');
        });
      };

      containerElement.addEventListener('mouseover', function (event) {
        var hitElement = event.target.closest('.hit');

        if (hitElement) {
          removeActiveMarkerClassNames();

          var objectID = parseInt(hitElement.id.substr(4), 10);
          var selector = '.my-custom-marker[data-id="' + objectID + '"]';
          var marker = document.querySelector(selector);

          if (marker) {
            marker.classList.add('my-custom-marker--active');
          }
        }
      });

      containerElement.addEventListener('mouseleave', function () {
        removeActiveMarkerClassNames();
      });

      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        customHTMLMarker: {
          createOptions: function createOptions() {
            return {
              anchor: {
                x: 0,
                y: 5
              }
            };
          },
          template: '\n                  <div class="my-custom-marker" data-id="{{objectID}}">\n                    {{price_formatted}}\n                  </div>\n                ',
          events: {
            mouseover: function mouseover(_ref7) {
              var item = _ref7.item;

              removeActiveHitClassNames();

              var hit = document.getElementById('hit-' + item.objectID);

              if (hit) {
                hit.classList.add('hit--active');
              }
            },
            mouseleave: function mouseleave() {
              removeActiveHitClassNames();
            }
          }
        },
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  })).add('with URLSync (simulate)', wrapWithHitsAndConfiguration(function (container, start) {
    return injectGoogleMaps(function () {
      container.style.height = '600px';

      window.search.addWidget(_index2.default.widgets.geoSearch({
        googleReference: window.google,
        container: container,
        initialPosition: initialPosition,
        initialZoom: initialZoom,
        paddingBoundingBox: paddingBoundingBox
      }));

      start();
    });
  }, {
    insideBoundingBox: [[48.84174222399724, 2.367719162523599, 48.81614630305218, 2.284205902635904]]
  }));
};