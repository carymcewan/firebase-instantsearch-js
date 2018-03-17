'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _rangeSlider = require('../range-slider.js');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var instantSearchInstance = { templatesConfig: undefined };

describe('rangeSlider', function () {
  it('throws an exception when no container', function () {
    var attributeName = '';
    expect(function () {
      return (0, _rangeSlider2.default)({ attributeName: attributeName });
    }).toThrow(/^Usage:/);
  });

  it('throws an exception when no attributeName', function () {
    var container = document.createElement('div');
    expect(function () {
      return (0, _rangeSlider2.default)({ container: container });
    }).toThrow(/^Usage:/);
  });

  describe('widget usage', function () {
    var attributeName = 'aNumAttr';

    var ReactDOM = void 0;
    var container = void 0;
    var helper = void 0;
    var widget = void 0;

    beforeEach(function () {
      ReactDOM = { render: jest.fn() };
      _rangeSlider2.default.__Rewire__('render', ReactDOM.render);

      container = document.createElement('div');
      helper = new _algoliasearchHelper2.default({
        search: function search() {},
        addAlgoliaAgent: function addAlgoliaAgent() {
          return {};
        }
      }, 'indexName', { disjunctiveFacets: ['aNumAttr'] });
    });

    afterEach(function () {
      _rangeSlider2.default.__ResetDependency__('render');
      _rangeSlider2.default.__ResetDependency__('autoHideContainerHOC');
      _rangeSlider2.default.__ResetDependency__('headerFooterHOC');
    });

    it('should render without results', function () {
      widget = (0, _rangeSlider2.default)({
        container: container,
        attributeName: attributeName,
        cssClasses: { root: ['root', 'cx'] }
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: [], helper: helper });

      expect(ReactDOM.render).toHaveBeenCalledTimes(1);
      expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should `shouldAutoHideContainer` when range min === max', function () {
      var results = {
        disjunctiveFacets: [{
          name: attributeName,
          stats: {
            min: 65,
            max: 65
          }
        }]
      };

      widget = (0, _rangeSlider2.default)({
        container: container,
        attributeName: attributeName,
        cssClasses: { root: ['root', 'cx'] }
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: results, helper: helper });

      expect(ReactDOM.render).toHaveBeenCalledTimes(1);
      expect(ReactDOM.render.mock.calls[0][0].props.shouldAutoHideContainer).toEqual(true);
      expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should `collapse` when options is provided', function () {
      var results = {};

      widget = (0, _rangeSlider2.default)({
        container: container,
        attributeName: attributeName,
        collapsible: {
          collapsed: true
        }
      });

      widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
      widget.render({ results: results, helper: helper });

      expect(ReactDOM.render).toHaveBeenCalledTimes(1);
      expect(ReactDOM.render.mock.calls[0][0].props.shouldAutoHideContainer).toEqual(true);
      expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
    });

    describe('min option', function () {
      it('refines when no previous configuration', function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, min: 100 });
        expect(widget.getConfiguration()).toEqual({
          disjunctiveFacets: [attributeName],
          numericRefinements: _defineProperty({}, attributeName, { '>=': [100] })
        });
      });

      it('does not refine when previous configuration', function () {
        widget = (0, _rangeSlider2.default)({
          container: container,
          attributeName: 'aNumAttr',
          min: 100
        });
        expect(widget.getConfiguration({
          numericRefinements: _defineProperty({}, attributeName, {})
        })).toEqual({
          disjunctiveFacets: [attributeName]
        });
      });

      it('works along with max option', function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, min: 100, max: 200 });
        expect(widget.getConfiguration()).toEqual({
          disjunctiveFacets: [attributeName],
          numericRefinements: _defineProperty({}, attributeName, {
            '>=': [100],
            '<=': [200]
          })
        });
      });

      it('sets the right range', function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, min: 100, max: 200 });
        helper.setState(widget.getConfiguration());
        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
        widget.render({ results: {}, helper: helper });

        expect(ReactDOM.render).toHaveBeenCalledTimes(1);
        expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
      });

      it('will use the results max when only min passed', function () {
        var results = {
          disjunctiveFacets: [{
            name: attributeName,
            stats: {
              min: 1.99,
              max: 4999.98
            }
          }]
        };

        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, min: 100 });
        helper.setState(widget.getConfiguration());
        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper });

        expect(ReactDOM.render).toHaveBeenCalledTimes(1);
        expect(ReactDOM.render.mock.calls[0][0].props.max).toEqual(5000);
        expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('max option', function () {
      it('refines when no previous configuration', function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, max: 100 });
        expect(widget.getConfiguration()).toEqual({
          disjunctiveFacets: [attributeName],
          numericRefinements: _defineProperty({}, attributeName, { '<=': [100] })
        });
      });

      it('does not refine when previous configuration', function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, max: 100 });
        expect(widget.getConfiguration({
          numericRefinements: _defineProperty({}, attributeName, {})
        })).toEqual({
          disjunctiveFacets: [attributeName]
        });
      });

      it('will use the results min when only max is passed', function () {
        var results = {
          disjunctiveFacets: [{
            name: attributeName,
            stats: {
              min: 1.99,
              max: 4999.98
            }
          }]
        };

        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName, max: 100 });
        helper.setState(widget.getConfiguration());
        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });
        widget.render({ results: results, helper: helper });

        expect(ReactDOM.render).toHaveBeenCalledTimes(1);
        expect(ReactDOM.render.mock.calls[0][0].props.min).toEqual(1);
        expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('with results', function () {
      var results = void 0;

      beforeEach(function () {
        widget = (0, _rangeSlider2.default)({ container: container, attributeName: attributeName });
        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });

        results = {
          disjunctiveFacets: [{
            name: attributeName,
            stats: {
              min: 1.99,
              max: 4999.98
            }
          }]
        };

        helper.search = jest.fn();
      });

      it('configures the disjunctiveFacets', function () {
        expect(widget.getConfiguration()).toEqual({
          disjunctiveFacets: [attributeName]
        });
      });

      it('calls twice ReactDOM.render', function () {
        widget.render({ results: results, helper: helper });
        widget.render({ results: results, helper: helper });

        expect(ReactDOM.render).toHaveBeenCalledTimes(2);
        expect(ReactDOM.render.mock.calls[0][0]).toMatchSnapshot();
        expect(ReactDOM.render.mock.calls[1][0]).toMatchSnapshot();
      });

      it('does not call the refinement functions if not refined', function () {
        var state0 = helper.state;
        widget.render({ results: results, helper: helper });
        var state1 = helper.state;

        expect(state0).toEqual(state1);
        expect(helper.search).not.toHaveBeenCalled();
      });

      it('calls the refinement function if refined with min+1', function () {
        var _results$disjunctiveF = _slicedToArray(results.disjunctiveFacets, 1),
            stats = _results$disjunctiveF[0].stats;

        var targetValue = stats.min + 1;

        var state0 = helper.state;
        widget._refine(helper, stats)([targetValue, stats.max]);
        var state1 = helper.state;

        expect(helper.search).toHaveBeenCalledTimes(1);
        expect(state1).toEqual(state0.addNumericRefinement(attributeName, '>=', 3));
      });

      it('calls the refinement function if refined with max-1', function () {
        var _results$disjunctiveF2 = _slicedToArray(results.disjunctiveFacets, 1),
            stats = _results$disjunctiveF2[0].stats;

        var targetValue = stats.max - 1;

        var state0 = helper.state;
        widget._refine(helper, stats)([stats.min, targetValue]);
        var state1 = helper.state;

        expect(helper.search).toHaveBeenCalledTimes(1);
        expect(state1).toEqual(state0.addNumericRefinement(attributeName, '<=', 4999));
      });

      it('calls the refinement function if refined with min+1 and max-1', function () {
        var _results$disjunctiveF3 = _slicedToArray(results.disjunctiveFacets, 1),
            stats = _results$disjunctiveF3[0].stats;

        var targetValue = [stats.min + 1, stats.max - 1];

        var state0 = helper.state;
        widget._refine(helper, stats)(targetValue);
        var state1 = helper.state;

        expect(helper.search).toHaveBeenCalledTimes(1);
        expect(state1).toEqual(state0.addNumericRefinement(attributeName, '>=', 3).addNumericRefinement(attributeName, '<=', 4999));
      });

      it("expect to clamp the min value to the max range when it's greater than range", function () {
        widget = (0, _rangeSlider2.default)({
          container: container,
          attributeName: attributeName
        });

        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });

        helper.addNumericRefinement(attributeName, '>=', 5550);
        helper.addNumericRefinement(attributeName, '<=', 6000);

        widget.render({ results: results, helper: helper });

        expect(ReactDOM.render.mock.calls[0][0].props.values[0]).toBe(5000);
      });

      it("expect to clamp the max value to the min range when it's lower than range", function () {
        widget = (0, _rangeSlider2.default)({
          container: container,
          attributeName: attributeName
        });

        widget.init({ helper: helper, instantSearchInstance: instantSearchInstance });

        helper.addNumericRefinement(attributeName, '>=', -50);
        helper.addNumericRefinement(attributeName, '<=', 0);

        widget.render({ results: results, helper: helper });

        expect(ReactDOM.render.mock.calls[0][0].props.values[1]).toBe(1);
      });
    });
  });
});