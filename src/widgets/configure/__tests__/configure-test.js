'use strict';

var _algoliasearchHelper = require('algoliasearch-helper');

var _configure = require('../configure');

var _configure2 = _interopRequireDefault(_configure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('configure', function () {
  it('throws when you pass it a non-plain object', function () {
    [function () {
      return (0, _configure2.default)(new Date());
    }, function () {
      return (0, _configure2.default)(function () {});
    }, function () {
      return (0, _configure2.default)(/ok/);
    }].forEach(function (widget) {
      return expect(widget).toThrowError(/Usage/);
    });
  });

  it('Applies searchParameters if nothing in configuration yet', function () {
    var widget = (0, _configure2.default)({ analytics: true });
    var config = widget.getConfiguration(_algoliasearchHelper.SearchParameters.make({}));
    expect(config).toEqual({
      analytics: true
    });
  });

  it('Applies searchParameters if nothing conflicting configuration', function () {
    var widget = (0, _configure2.default)({ analytics: true });
    var config = widget.getConfiguration(_algoliasearchHelper.SearchParameters.make({ query: 'testing' }));
    expect(config).toEqual({
      analytics: true
    });
  });

  it('Applies searchParameters with a higher priority', function () {
    var widget = (0, _configure2.default)({ analytics: true });
    {
      var config = widget.getConfiguration(_algoliasearchHelper.SearchParameters.make({ analytics: false }));
      expect(config).toEqual({
        analytics: true
      });
    }
    {
      var _config = widget.getConfiguration(_algoliasearchHelper.SearchParameters.make({ analytics: false, extra: true }));
      expect(_config).toEqual({
        analytics: true
      });
    }
  });

  it('disposes all of the state set by configure', function () {
    var widget = (0, _configure2.default)({ analytics: true });

    var nextState = widget.dispose({
      state: _algoliasearchHelper.SearchParameters.make({
        analytics: true,
        somethingElse: false
      })
    });

    expect(nextState).toEqual(_algoliasearchHelper.SearchParameters.make({
      somethingElse: false
    }));
  });

  it('disposes all of the state set by configure in case of a conflict', function () {
    var widget = (0, _configure2.default)({ analytics: true });

    var nextState = widget.dispose({
      state: _algoliasearchHelper.SearchParameters.make({
        // even though it's different, it will be deleted
        analytics: false,
        somethingElse: false
      })
    });

    expect(nextState).toEqual(_algoliasearchHelper.SearchParameters.make({
      somethingElse: false
    }));
  });
});