'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createHTMLMarker = require('../createHTMLMarker');

var _createHTMLMarker2 = _interopRequireDefault(_createHTMLMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('createHTMLMarker', function () {
  var FakeOverlayView = function FakeOverlayView() {
    _classCallCheck(this, FakeOverlayView);

    this.setMap = jest.fn();
    this.getPanes = jest.fn(function () {
      return {
        overlayMouseTarget: {
          appendChild: jest.fn()
        }
      };
    });
    this.getProjection = jest.fn(function () {
      return {
        fromLatLngToDivPixel: jest.fn(function () {
          return {
            x: 0,
            y: 0
          };
        })
      };
    });
  };

  var createFakeGoogleReference = function createFakeGoogleReference() {
    return {
      maps: {
        LatLng: jest.fn(function (x) {
          return x;
        }),
        // Required to be a constructor since
        // we extend from it in the Marker class
        OverlayView: FakeOverlayView
      }
    };
  };

  var createFakeParams = function createFakeParams(_ref) {
    var rest = _objectWithoutProperties(_ref, []);

    return _extends({
      __id: 123456789,
      position: {
        lat: 10,
        lng: 12
      },
      map: 'map-instance-placeholder',
      template: '<div>Hello</div>',
      className: 'ais-geo-search-marker'
    }, rest);
  };

  it('expect to create a marker', function () {
    var googleReference = createFakeGoogleReference();
    var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
    var params = createFakeParams();

    var marker = new HTMLMarker(params);

    expect(marker.__id).toBe(123456789);
    expect(marker.anchor).toEqual({ x: 0, y: 0 });
    expect(marker.listeners).toEqual({});
    expect(marker.latLng).toEqual({ lat: 10, lng: 12 });

    expect(marker.element).toEqual(expect.any(HTMLDivElement));
    expect(marker.element.className).toBe('ais-geo-search-marker');
    expect(marker.element.style.position).toBe('absolute');
    expect(marker.element.innerHTML).toBe('<div>Hello</div>');

    expect(marker.setMap).toHaveBeenCalledWith('map-instance-placeholder');
  });

  it('expect to create a marker with a custom anchor', function () {
    var googleReference = createFakeGoogleReference();
    var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
    var params = createFakeParams({
      anchor: {
        x: 5,
        y: 10
      }
    });

    var marker = new HTMLMarker(params);

    expect(marker.anchor).toEqual({ x: 5, y: 10 });
  });

  describe('onAdd', function () {
    it('expect to append the element to the overlay', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();
      var overlayMouseTarget = {
        appendChild: jest.fn()
      };

      var marker = new HTMLMarker(params);

      marker.getPanes.mockImplementationOnce(function () {
        return { overlayMouseTarget: overlayMouseTarget };
      });

      marker.onAdd();

      expect(overlayMouseTarget.appendChild).toHaveBeenCalledWith(marker.element);
    });

    it('expect to compute the element offset', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();

      var marker = new HTMLMarker(params);

      marker.element.getBoundingClientRect = function () {
        return {
          width: 50,
          height: 30
        };
      };

      marker.onAdd();

      expect(marker.offset).toEqual({ x: 25, y: 30 });
    });

    it('expect to compute the element offset with an anchor', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams({
        anchor: {
          x: 5,
          y: 10
        }
      });

      var marker = new HTMLMarker(params);

      marker.element.getBoundingClientRect = function () {
        return {
          width: 50,
          height: 30
        };
      };

      marker.onAdd();

      expect(marker.offset).toEqual({ x: 30, y: 40 });
    });

    it('expect to force the element width from the BBox', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams({
        anchor: {
          x: 5,
          y: 10
        }
      });

      var marker = new HTMLMarker(params);

      marker.element.getBoundingClientRect = function () {
        return {
          width: 50
        };
      };

      marker.onAdd();

      expect(marker.element.style.width).toBe('50px');
    });
  });

  describe('draw', function () {
    it('expect to set the correct position on the element', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();
      var fromLatLngToDivPixel = jest.fn(function () {
        return {
          x: 100,
          y: 50
        };
      });

      var marker = new HTMLMarker(params);

      marker.getProjection.mockImplementationOnce(function () {
        return {
          fromLatLngToDivPixel: fromLatLngToDivPixel
        };
      });

      // Simulate the offset
      marker.offset = {
        x: 50,
        y: 30
      };

      marker.draw();

      expect(fromLatLngToDivPixel).toHaveBeenCalledWith({ lat: 10, lng: 12 });
      expect(marker.element.style.left).toBe('50px');
      expect(marker.element.style.top).toBe('20px');
    });

    it('expect to set the correct zIndex on the element', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();
      var fromLatLngToDivPixel = jest.fn(function () {
        return {
          x: 100,
          y: 50
        };
      });

      var marker = new HTMLMarker(params);

      marker.getProjection.mockImplementationOnce(function () {
        return {
          fromLatLngToDivPixel: fromLatLngToDivPixel
        };
      });

      // Simulate the offset
      marker.offset = {
        x: 50,
        y: 30
      };

      marker.draw();

      expect(marker.element.style.zIndex).toBe('20');
    });
  });

  describe('onRemove', function () {
    it('expect to remove the element', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();

      var marker = new HTMLMarker(params);

      // Simulate the parentNode
      var parentNode = document.createElement('div');
      parentNode.appendChild(marker.element);

      expect(parentNode.childNodes).toHaveLength(1);

      marker.onRemove();

      expect(parentNode.childNodes).toHaveLength(0);
      expect(marker.element).toBe(undefined);
    });

    it('expect to remove all the listeners', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();
      var onClick = function onClick() {};
      var onMouseOver = function onMouseOver() {};

      var marker = new HTMLMarker(params);

      var removeEventListener = jest.spyOn(marker.element, 'removeEventListener');

      // Simulate the parentNode
      var parentNode = document.createElement('div');
      parentNode.appendChild(marker.element);

      // Simulate the listeners
      marker.listeners = {
        click: onClick,
        mouseover: onMouseOver
      };

      marker.onRemove();

      expect(marker.listeners).toBe(undefined);
      expect(removeEventListener).toHaveBeenCalledTimes(2);
      expect(removeEventListener).toHaveBeenCalledWith('click', onClick);
      expect(removeEventListener).toHaveBeenCalledWith('mouseover', onMouseOver);
    });
  });

  describe('addListener', function () {
    it('expect to register listener', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();
      var onClick = function onClick() {};

      var marker = new HTMLMarker(params);

      var addEventListener = jest.spyOn(marker.element, 'addEventListener');

      marker.addListener('click', onClick);

      expect(addEventListener).toHaveBeenCalledTimes(1);
      expect(addEventListener).toHaveBeenCalledWith('click', onClick);
      expect(marker.listeners).toEqual({ click: onClick });
    });
  });

  describe('getPosition', function () {
    it('expect to return the latLng', function () {
      var googleReference = createFakeGoogleReference();
      var HTMLMarker = (0, _createHTMLMarker2.default)(googleReference);
      var params = createFakeParams();

      var marker = new HTMLMarker(params);

      var actual = marker.getPosition();
      var expectation = { lat: 10, lng: 12 };

      expect(actual).toEqual(expectation);
    });
  });
});