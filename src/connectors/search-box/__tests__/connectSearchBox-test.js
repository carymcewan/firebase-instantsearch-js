'use strict';

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectSearchBox = require('../connectSearchBox.js');

var _connectSearchBox2 = _interopRequireDefault(_connectSearchBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectSearchBox', function () {
    it('Renders during init and render', function () {
        // test that the dummyRendering is called with the isFirstRendering
        // flag set accordingly
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        var widget = makeWidget({
            foo: 'bar' // dummy param passed to `renderFn`
        });

        expect(widget.getConfiguration).toBe(undefined);

        var helper = (0, _algoliasearchHelper2.default)(fakeClient);
        helper.search = function () {};

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        // should call the rendering once with isFirstRendering to true
        expect(rendering).toHaveBeenCalledTimes(1);
        // should provide good values for the first rendering
        expect(rendering).toHaveBeenLastCalledWith(expect.objectContaining({
            query: helper.state.query,
            widgetParams: { foo: 'bar' }
        }), true);

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        // Should call the rendering a second time, with isFirstRendering to false
        expect(rendering).toHaveBeenCalledTimes(2);
        // should provide good values after the first search
        expect(rendering).toHaveBeenLastCalledWith(expect.objectContaining({
            query: helper.state.query,
            widgetParams: { foo: 'bar' }
        }), false);
    });

    it('Provides a function to update the refinements at each step', function () {
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        var widget = makeWidget();

        var helper = (0, _algoliasearchHelper2.default)(fakeClient);
        helper.search = jest.fn();

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        {
            // first rendering
            expect(helper.state.query).toBe('');
            var refine = rendering.mock.calls[0][0].refine;

            refine('bip');
            expect(helper.state.query).toBe('bip');
            expect(helper.search).toHaveBeenCalledTimes(1);
        }

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        {
            // Second rendering
            expect(helper.state.query).toBe('bip');
            var _rendering$mock$calls = rendering.mock.calls[1][0],
                _refine = _rendering$mock$calls.refine,
                query = _rendering$mock$calls.query;

            expect(query).toBe('bip');
            _refine('bop');
            expect(helper.state.query).toBe('bop');
            expect(helper.search).toHaveBeenCalledTimes(2);
        }
    });

    it('provides a function to clear the query and perform new search', function () {
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        var widget = makeWidget();

        var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {
            query: 'bup'
        });
        helper.search = jest.fn();

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        {
            // first rendering
            expect(helper.state.query).toBe('bup');
            var _rendering$mock$calls2 = rendering.mock.calls[0][0],
                refine = _rendering$mock$calls2.refine,
                clear = _rendering$mock$calls2.clear;

            clear(); // triggers a search
            expect(helper.state.query).toBe('');
            expect(helper.search).toHaveBeenCalledTimes(1);
            refine('bip'); // triggers a search
        }

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        {
            // Second rendering
            expect(helper.state.query).toBe('bip');
            var _clear = rendering.mock.calls[1][0].clear;

            _clear(); // triggers a search
            expect(helper.state.query).toBe('');
            // refine and clear functions trigger searches. clear + refine + clear
            expect(helper.search).toHaveBeenCalledTimes(3);
        }
    });

    it('queryHook parameter let the dev control the behavior of the search', function () {
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        // letSearchThrough will control if the provided function should be called
        var letSearchThrough = false;
        var queryHook = jest.fn(function (q, search) {
            if (letSearchThrough) search(q);
        });

        var widget = makeWidget({
            queryHook: queryHook
        });

        var helper = (0, _algoliasearchHelper2.default)(fakeClient);
        helper.search = jest.fn();

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        {
            // first rendering
            var refine = rendering.mock.calls[0][0].refine;


            refine('bip');
            expect(queryHook).toHaveBeenCalledTimes(1);
            expect(helper.state.query).toBe('');
            expect(helper.search).not.toHaveBeenCalled();

            letSearchThrough = true;
            refine('bip');
            expect(queryHook).toHaveBeenCalledTimes(2);
            expect(helper.state.query).toBe('bip');
            expect(helper.search).toHaveBeenCalledTimes(1);
        }

        // reset the hook behavior
        letSearchThrough = false;

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        {
            // Second rendering
            var _refine2 = rendering.mock.calls[1][0].refine;


            _refine2('bop');
            expect(queryHook).toHaveBeenCalledTimes(3);
            expect(helper.state.query).toBe('bip');
            expect(helper.search).toHaveBeenCalledTimes(1);

            letSearchThrough = true;
            _refine2('bop');
            expect(queryHook).toHaveBeenCalledTimes(4);
            expect(helper.state.query).toBe('bop');
            expect(helper.search).toHaveBeenCalledTimes(2);
        }
    });

    it('should always provide the same refine() and clear() function reference', function () {
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        var widget = makeWidget();

        var helper = (0, _algoliasearchHelper2.default)(fakeClient);
        helper.search = function () {};

        widget.init({
            helper: helper,
            state: helper.state,
            createURL: function createURL() {
                return '#';
            },
            onHistoryChange: function onHistoryChange() {}
        });

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        var firstRenderOptions = rendering.mock.calls[0][0];

        widget.render({
            results: new SearchResults(helper.state, [{}]),
            state: helper.state,
            helper: helper,
            createURL: function createURL() {
                return '#';
            },
            searchMetadata: { isSearchStalled: false }
        });

        var secondRenderOptions = rendering.mock.calls[1][0];

        expect(firstRenderOptions.clear).toBe(secondRenderOptions.clear);
        expect(firstRenderOptions.refine).toBe(secondRenderOptions.refine);
    });

    it('should clear on init as well', function () {
        var rendering = jest.fn();
        var makeWidget = (0, _connectSearchBox2.default)(rendering);

        var widget = makeWidget();

        var helper = (0, _algoliasearchHelper2.default)(fakeClient);
        helper.search = jest.fn();
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

        var clear = rendering.mock.calls[0][0].clear;

        clear();

        expect(helper.state.query).toBe('');
        expect(helper.search).toHaveBeenCalledTimes(1);
    });
});