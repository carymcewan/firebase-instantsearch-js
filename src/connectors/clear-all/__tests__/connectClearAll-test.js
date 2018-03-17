'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectClearAll = require('../connectClearAll.js');

var _connectClearAll2 = _interopRequireDefault(_connectClearAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

describe('connectClearAll', function () {
    it('Renders during init and render', function () {
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
        helper.search = _sinon2.default.stub();
        // test that the dummyRendering is called with the isFirstRendering
        // flag set accordingly
        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
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
        expect(firstRenderingOptions.hasRefinements).toBe(false);
        expect(firstRenderingOptions.widgetParams).toEqual({
            foo: 'bar' // dummy param to test `widgetParams`
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
        expect(secondRenderingOptions.hasRefinements).toBe(false);
    });

    it('Receives a mean to clear the values', function () {
        // test the function received by the rendering function
        // to clear the refinements

        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', {
            facets: ['myFacet']
        });
        helper.search = _sinon2.default.stub();
        helper.setQuery('not empty');
        helper.toggleRefinement('myFacet', 'myValue');

        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
        var widget = makeWidget({ clearsQuery: false });

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        expect(helper.hasRefinements('myFacet')).toBe(true);
        expect(helper.state.query).toBe('not empty');
        var initClearMethod = rendering.lastCall.args[0].refine;
        initClearMethod();

        expect(helper.hasRefinements('myFacet')).toBe(false);
        expect(helper.state.query).toBe('not empty');

        helper.toggleRefinement('myFacet', 'someOtherValue');

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        expect(helper.hasRefinements('myFacet')).toBe(true);
        expect(helper.state.query).toBe('not empty');
        var renderClearMethod = rendering.lastCall.args[0].refine;
        renderClearMethod();
        expect(helper.hasRefinements('myFacet')).toBe(false);
        expect(helper.state.query).toBe('not empty');
    });

    it('Receives a mean to clear the values (and the query)', function () {
        // test the function received by the rendering function
        // to clear the refinements

        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, '', {
            facets: ['myFacet']
        });
        helper.search = _sinon2.default.stub();
        helper.setQuery('a query');
        helper.toggleRefinement('myFacet', 'myValue');

        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
        var widget = makeWidget({ clearsQuery: true });

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        expect(helper.hasRefinements('myFacet')).toBe(true);
        expect(helper.state.query).toBe('a query');
        var initClearMethod = rendering.lastCall.args[0].refine;
        initClearMethod();

        expect(helper.hasRefinements('myFacet')).toBe(false);
        expect(helper.state.query).toBe('');

        helper.toggleRefinement('myFacet', 'someOtherValue');
        helper.setQuery('another query');

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        expect(helper.hasRefinements('myFacet')).toBe(true);
        expect(helper.state.query).toBe('another query');
        var renderClearMethod = rendering.lastCall.args[0].refine;
        renderClearMethod();
        expect(helper.hasRefinements('myFacet')).toBe(false);
        expect(helper.state.query).toBe('');
    });

    it('some refinements from results <=> hasRefinements = true', function () {
        // test if the values sent to the rendering function
        // are consistent with the search state
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, undefined, {
            facets: ['aFacet']
        });
        helper.toggleRefinement('aFacet', 'some value');
        helper.search = _sinon2.default.stub();

        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
        var widget = makeWidget();

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(true);

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(true);
    });

    it('(clearsQuery: true) query not empty <=> hasRefinements = true', function () {
        // test if the values sent to the rendering function
        // are consistent with the search state
        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} }, undefined, {
            facets: ['aFacet']
        });
        helper.setQuery('no empty');
        helper.search = _sinon2.default.stub();

        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
        var widget = makeWidget({
            clearsQuery: true
        });

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(true);

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(true);
    });

    it('(clearsQuery: false) no refinements <=> hasRefinements = false', function () {
        // test if the values sent to the rendering function
        // are consistent with the search state

        var helper = (0, _algoliasearchHelper2.default)({ addAlgoliaAgent: function addAlgoliaAgent() {} });
        helper.setQuery('not empty');
        helper.search = _sinon2.default.stub();

        var rendering = _sinon2.default.stub();
        var makeWidget = (0, _connectClearAll2.default)(rendering);
        var widget = makeWidget({ clearsQuery: false });

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(false);

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            }
        });

        expect(rendering.lastCall.args[0].hasRefinements).toBe(false);
    });
});