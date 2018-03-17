'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectCurrentRefinedValues = require('../connectCurrentRefinedValues.js');

var _connectCurrentRefinedValues2 = _interopRequireDefault(_connectCurrentRefinedValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;


describe('connectCurrentRefinedValues', function () {
    it('Renders during init and render', function () {
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
        helper.search = _sinon2.default.stub();
        // test that the dummyRendering is called with the isFirstRendering
        // flag set accordingly
        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectCurrentRefinedValues2.default)(rendering);
        var widget = makeWidget({
            foo: 'bar' // dummy param to test `widgetParams`
        });

        expect(widget.getConfiguration).toBe(undefined);
        // test if widget is not rendered yet at this point
        expect(rendering.callCount).toBe(0);

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        // test that rendering has been called during init with isFirstRendering = true
        expect(rendering.callCount).toBe(1);
        // test if isFirstRendering is true during init
        expect(rendering.lastCall.args[1]).toBe(true);

        var firstRenderingOptions = rendering.lastCall.args[0];
        expect(firstRenderingOptions.refinements).toEqual([]);
        expect(firstRenderingOptions.widgetParams).toEqual({
            foo: 'bar'
        });

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        // test that rendering has been called during init with isFirstRendering = false
        expect(rendering.callCount).toBe(2);
        expect(rendering.lastCall.args[1]).toBe(false);

        var secondRenderingOptions = rendering.lastCall.args[0];
        expect(secondRenderingOptions.refinements).toEqual([]);
        expect(secondRenderingOptions.widgetParams).toEqual({
            foo: 'bar'
        });
    });

    it('Provide a function to clear the refinement', function () {
        // For each refinements we get a function that we can call
        // for removing a single refinement
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', {
            facets: ['myFacet']
        });
        helper.search = _sinon2.default.stub();
        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectCurrentRefinedValues2.default)(rendering);
        var widget = makeWidget();

        helper.addFacetRefinement('myFacet', 'value');

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        var firstRenderingOptions = rendering.lastCall.args[0];
        var refinements = firstRenderingOptions.refinements;
        expect(_typeof(firstRenderingOptions.refine)).toBe('function');
        expect(refinements).toHaveLength(1);
        firstRenderingOptions.refine(refinements[0]);
        expect(helper.hasRefinements('myFacet')).toBe(false);

        helper.addFacetRefinement('myFacet', 'value');

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        var secondRenderingOptions = rendering.lastCall.args[0];
        var otherRefinements = secondRenderingOptions.refinements;
        expect(_typeof(secondRenderingOptions.refine)).toBe('function');
        expect(otherRefinements).toHaveLength(1);
        secondRenderingOptions.refine(refinements[0]);
        expect(helper.hasRefinements('myFacet')).toBe(false);
    });

    it('should clear also the search query', function () {
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', {});
        helper.search = jest.fn();

        var rendering = jest.fn();
        var makeWidget = (0, _connectCurrentRefinedValues2.default)(rendering);
        var widget = makeWidget({ clearsQuery: true });

        helper.setQuery('foobar');
        expect(helper.state.query).toBe('foobar');

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        // clear current refined values + query
        expect(rendering).toBeCalled();

        var _rendering$mock$calls = _slicedToArray(rendering.mock.calls[0], 1),
            clearAllClick = _rendering$mock$calls[0].clearAllClick;

        clearAllClick();

        expect(helper.search).toBeCalled();
        expect(helper.state.query).toBe('');
    });

    it('should provide the query as a refinement if clearsQuery is true', function () {
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', {});
        helper.search = jest.fn();

        var rendering = jest.fn();
        var makeWidget = (0, _connectCurrentRefinedValues2.default)(rendering);
        var widget = makeWidget({ clearsQuery: true });

        helper.setQuery('foobar');

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        var firstRenderingOptions = rendering.mock.calls[0][0];
        var refinements = firstRenderingOptions.refinements;
        expect(refinements).toHaveLength(1);
        var value = refinements[0];
        expect(value.type).toBe('query');
        expect(value.name).toBe('foobar');
        expect(value.query).toBe('foobar');
        var refine = firstRenderingOptions.refine;
        refine(value);
        expect(helper.state.query).toBe('');

        helper.setQuery('foobaz');

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        var secondRenderingOptions = rendering.mock.calls[1][0];
        var secondRefinements = secondRenderingOptions.refinements;
        expect(secondRefinements).toHaveLength(1);
        var secondValue = secondRefinements[0];
        expect(secondValue.type).toBe('query');
        expect(secondValue.name).toBe('foobaz');
        expect(secondValue.query).toBe('foobaz');
        var secondRefine = secondRenderingOptions.refine;
        secondRefine(secondValue);
        expect(helper.state.query).toBe('');
    });
});