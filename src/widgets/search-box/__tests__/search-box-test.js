'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _searchBox = require('../search-box');

var _searchBox2 = _interopRequireDefault(_searchBox);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createHTMLNodeFromString(string) {
  var parent = document.createElement('div');
  parent.innerHTML = string;
  return parent.firstChild;
}

var onHistoryChange = function onHistoryChange() {};

describe('searchBox()', function () {
  var container = void 0;
  var state = void 0;
  var helper = void 0;
  var widget = void 0;

  beforeEach(function () {
    state = {
      query: ''
    };
    helper = _extends({
      setQuery: jest.fn(),
      search: jest.fn(),
      state: {
        query: ''
      }
    }, _events2.default.prototype);
  });

  describe('bad usage', function () {
    it('throws an error if container is not defined', function () {
      expect(function () {
        (0, _searchBox2.default)({ container: null });
      }).toThrow(/Usage:/);
    });
  });

  describe('targeting a div', function () {
    var opts = void 0;

    beforeEach(function () {
      container = document.createElement('div');
      opts = { container: container };
    });

    it('adds an input inside the div', function () {
      widget = (0, _searchBox2.default)(opts);
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      var inputs = container.getElementsByTagName('input');
      expect(inputs).toHaveLength(1);
    });

    it('add a reset button inside the div', function () {
      widget = (0, _searchBox2.default)(opts);
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      var button = container.getElementsByTagName('button');
      expect(button).toHaveLength(1);
    });

    it('add a magnifier inside the div', function () {
      widget = (0, _searchBox2.default)(opts);
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      var magnifier = container.getElementsByClassName('ais-search-box--magnifier');
      expect(magnifier).toHaveLength(1);
    });

    it('sets default HTML attribute to the input', function () {
      widget = (0, _searchBox2.default)(opts);
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      var input = container.getElementsByTagName('input')[0];
      expect(input.getAttribute('autocapitalize')).toEqual('off');
      expect(input.getAttribute('autocomplete')).toEqual('off');
      expect(input.getAttribute('autocorrect')).toEqual('off');
      expect(input.getAttribute('class')).toEqual('ais-search-box--input');
      expect(input.getAttribute('placeholder')).toEqual('');
      expect(input.getAttribute('role')).toEqual('textbox');
      expect(input.getAttribute('spellcheck')).toEqual('false');
      expect(input.getAttribute('type')).toEqual('text');
    });

    it('supports cssClasses option', function () {
      opts.cssClasses = {
        root: ['root-class', 'cx'],
        input: 'input-class'
      };

      widget = (0, _searchBox2.default)(opts);
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      var actualRootClasses = container.querySelector('input').parentNode.getAttribute('class');
      var actualInputClasses = container.querySelector('input').getAttribute('class');
      var expectedRootClasses = 'ais-search-box root-class cx';
      var expectedInputClasses = 'ais-search-box--input input-class';

      expect(actualRootClasses).toEqual(expectedRootClasses);
      expect(actualInputClasses).toEqual(expectedInputClasses);
    });
  });

  describe('targeting an input', function () {
    it('reuse the existing input', function () {
      container = document.body.appendChild(document.createElement('input'));
      widget = (0, _searchBox2.default)({ container: container });
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      expect(container.tagName).toEqual('INPUT');
      expect(container.getAttribute('autocapitalize')).toEqual('off');
      expect(container.getAttribute('autocomplete')).toEqual('off');
      expect(container.getAttribute('autocorrect')).toEqual('off');
      expect(container.getAttribute('class')).toEqual('ais-search-box--input');
      expect(container.getAttribute('placeholder')).toEqual('');
      expect(container.getAttribute('role')).toEqual('textbox');
      expect(container.getAttribute('spellcheck')).toEqual('false');
      expect(container.getAttribute('type')).toEqual('text');
    });

    it('passes HTML attributes', function () {
      container = createHTMLNodeFromString('<input id="foo" class="my-class" placeholder="Search" />');
      widget = (0, _searchBox2.default)({ container: container });
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
      expect(container.getAttribute('id')).toEqual('foo');
      expect(container.getAttribute('class')).toEqual('my-class ais-search-box--input');
      expect(container.getAttribute('placeholder')).toEqual('Search');
    });

    it('supports cssClasses', function () {
      container = createHTMLNodeFromString('<input class="my-class" />');
      widget = (0, _searchBox2.default)({
        container: container,
        cssClasses: { root: 'root-class', input: 'input-class' }
      });
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });

      var actualRootClasses = container.parentNode.getAttribute('class');
      var actualInputClasses = container.getAttribute('class');
      var expectedRootClasses = 'ais-search-box root-class';
      var expectedInputClasses = 'my-class ais-search-box--input input-class';

      expect(actualRootClasses).toEqual(expectedRootClasses);
      expect(actualInputClasses).toEqual(expectedInputClasses);
    });
  });

  describe('wraps the input in a div', function () {
    it('when targeting a div', function () {
      // Given
      container = document.createElement('div');
      widget = (0, _searchBox2.default)({ container: container });

      // When
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });

      // Then
      var wrapper = container.querySelectorAll('div.ais-search-box')[0];
      var input = container.querySelectorAll('input')[0];

      expect(wrapper.contains(input)).toEqual(true);
      expect(wrapper.getAttribute('class')).toEqual('ais-search-box');
    });

    it('when targeting an input', function () {
      // Given
      container = document.body.appendChild(document.createElement('input'));
      widget = (0, _searchBox2.default)({ container: container });

      // When
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });

      // Then
      var wrapper = container.parentNode;
      expect(wrapper.getAttribute('class')).toEqual('ais-search-box');
    });

    it('can be disabled with wrapInput:false', function () {
      // Given
      container = document.createElement('div');
      widget = (0, _searchBox2.default)({ container: container, wrapInput: false });

      // When
      widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });

      // Then
      var wrapper = container.querySelectorAll('div.ais-search-box');
      var input = container.querySelectorAll('input')[0];
      expect(wrapper).toHaveLength(0);
      expect(container.firstChild).toEqual(input);
    });
  });

  describe('reset', function () {
    var defaultInitOptions = void 0;
    var defaultWidgetOptions = void 0;
    var $ = void 0;

    beforeEach(function () {
      container = document.createElement('div');
      $ = container.querySelectorAll.bind(container);
      defaultWidgetOptions = { container: container };
      defaultInitOptions = { state: state, helper: helper, onHistoryChange: onHistoryChange };
    });

    it('should be hidden when there is no query', function () {
      // Given
      widget = (0, _searchBox2.default)(defaultWidgetOptions);

      // When
      widget.init(defaultInitOptions);

      // Then
      expect($('.ais-search-box--reset-wrapper')[0].style.display).toBe('none');
    });

    it('should be shown when there is a query', function () {
      // Given
      widget = (0, _searchBox2.default)(defaultWidgetOptions);

      // When
      widget.init(defaultInitOptions);
      simulateInputEvent('test', 'tes', widget, helper, state, container);

      // Then
      expect($('.ais-search-box--reset-wrapper')[0].style.display).toBe('block');
    });

    it('should clear the query', function () {
      // Given
      widget = (0, _searchBox2.default)(defaultWidgetOptions);
      widget.init(defaultInitOptions);
      simulateInputEvent('test', 'tes', widget, helper, state, container);

      // When
      $('.ais-search-box--reset-wrapper')[0].click();

      // Then
      expect(helper.setQuery).toHaveBeenCalled();
      expect(helper.search).toHaveBeenCalled();
    });

    it('should let the user define its own string template', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        reset: {
          template: '<button type="reset">Foobar</button>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar');
    });

    it('should not exist when it is disabled', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        reset: false
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect($('.ais-search-box--reset-wrapper')).toHaveLength(0);
    });
  });

  describe('magnifier', function () {
    var defaultInitOptions = void 0;
    var defaultWidgetOptions = void 0;

    beforeEach(function () {
      container = document.createElement('div');
      defaultWidgetOptions = { container: container };
      defaultInitOptions = { state: state, helper: helper, onHistoryChange: onHistoryChange };
    });

    it('should let the user define its own string template', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        magnifier: {
          template: '<div>Foobar</button>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar');
    });
  });

  describe('poweredBy', function () {
    var defaultInitOptions = void 0;
    var defaultWidgetOptions = void 0;
    var $ = void 0;

    beforeEach(function () {
      container = document.createElement('div');
      $ = container.querySelectorAll.bind(container);
      defaultWidgetOptions = { container: container };
      defaultInitOptions = { state: state, helper: helper, onHistoryChange: onHistoryChange };
    });

    it('should not add the element with default options', function () {
      // Given
      widget = (0, _searchBox2.default)(defaultWidgetOptions);

      // When
      widget.init(defaultInitOptions);

      // Then
      expect($('.ais-search-box--powered-by')).toHaveLength(0);
    });

    it('should not add the element with poweredBy: false', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: false
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect($('.ais-search-box--powered-by')).toHaveLength(0);
    });

    it('should add the element with poweredBy: true', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: true
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect($('.ais-search-box--powered-by')).toHaveLength(1);
    });

    it('should contain a link to Algolia with poweredBy: true', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: true
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      var actual = $('.ais-search-box--powered-by-link');
      var url = 'https://www.algolia.com/?utm_source=instantsearch.js&utm_medium=website&utm_content=' + location.hostname + '&utm_campaign=poweredby';
      expect(actual).toHaveLength(1);
      expect(actual[0].tagName).toEqual('A');
      expect(actual[0].innerHTML).toEqual('Algolia');
      expect(actual[0].getAttribute('href')).toEqual(url);
    });

    it('should let user add its own CSS classes with poweredBy.cssClasses', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          cssClasses: {
            root: 'myroot',
            link: 'mylink'
          }
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      var root = $('.myroot');
      var link = $('.mylink');
      expect(root).toHaveLength(1);
      expect(link).toHaveLength(1);
      expect(link[0].tagName).toEqual('A');
      expect(link[0].innerHTML).toEqual('Algolia');
    });

    it('should still apply default CSS classes even if user provides its own', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          cssClasses: {
            root: 'myroot',
            link: 'mylink'
          }
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      var root = $('.ais-search-box--powered-by');
      var link = $('.ais-search-box--powered-by-link');
      expect(root).toHaveLength(1);
      expect(link).toHaveLength(1);
    });

    it('should let the user define its own string template', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          template: '<div>Foobar</div>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar');
    });

    it('should let the user define its own Hogan template', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          template: '<div>Foobar--{{url}}</div>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar--https://www.algolia.com/');
    });

    it('should let the user define its own function template', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          template: function template(data) {
            return '<div>Foobar--' + data.url + '</div>';
          }
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar--https://www.algolia.com/');
    });

    it('should gracefully handle templates with leading spaces', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          template: '\n\n          <div>Foobar</div>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar');
    });

    it('should handle templates not wrapped in a node', function () {
      // Given
      widget = (0, _searchBox2.default)(_extends({}, defaultWidgetOptions, {
        poweredBy: {
          template: 'Foobar <img src="./test.gif" class="should-be-found"/>'
        }
      }));

      // When
      widget.init(defaultInitOptions);

      // Then
      expect(container.innerHTML).toContain('Foobar');
      expect($('.should-be-found')).toHaveLength(1);
    });
  });

  describe('input event listener', function () {
    beforeEach(function () {
      container = document.body.appendChild(document.createElement('input'));
    });

    describe('instant search', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container });
      });

      it('performs a search on any change', function () {
        simulateInputEvent('test', 'tes', widget, helper, state, container);
        expect(helper.search).toHaveBeenCalled();
      });

      it('sets the query on any change', function () {
        simulateInputEvent('test', 'tes', widget, helper, state, container);
        expect(helper.setQuery).toHaveBeenCalledTimes(1);
      });

      it('does nothing when query is the same as state', function () {
        simulateInputEvent('test', 'test', widget, helper, state, container);
        expect(helper.setQuery).not.toHaveBeenCalled();
        expect(helper.search).not.toHaveBeenCalled();
      });
    });

    describe('non-instant search and input event', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container, searchOnEnterKeyPressOnly: true });
        simulateInputEvent('test', 'tes', widget, helper, state, container);
      });

      it('updates the query', function () {
        expect(helper.setQuery).toHaveBeenCalledTimes(1);
      });

      it('does not search', function () {
        expect(helper.search).toHaveBeenCalledTimes(0);
      });
    });

    describe('using a queryHook', function () {
      it('calls the queryHook', function () {
        var queryHook = jest.fn();
        widget = (0, _searchBox2.default)({ container: container, queryHook: queryHook });
        simulateInputEvent('queryhook input', 'tes', widget, helper, state, container);
        expect(queryHook).toHaveBeenCalledTimes(1);
        expect(queryHook).toHaveBeenLastCalledWith('queryhook input', expect.any(Function));
      });

      it('does not perform a search by default', function () {
        var queryHook = jest.fn();
        widget = (0, _searchBox2.default)({ container: container, queryHook: queryHook });
        simulateInputEvent('test', 'tes', widget, helper, state, container);
        expect(helper.setQuery).toHaveBeenCalledTimes(0);
        expect(helper.search).not.toHaveBeenCalled();
      });

      it('when calling the provided search function', function () {
        var queryHook = jest.fn(function (query, search) {
          return search(query);
        });
        widget = (0, _searchBox2.default)({ container: container, queryHook: queryHook });
        simulateInputEvent('oh rly?', 'tes', widget, helper, state, container);
        expect(helper.setQuery).toHaveBeenCalledTimes(1);
        expect(helper.setQuery).toHaveBeenLastCalledWith('oh rly?');
        expect(helper.search).toHaveBeenCalled();
      });

      it('can override the query', function () {
        var queryHook = jest.fn(function (originalQuery, search) {
          return search('hi mom!');
        });
        widget = (0, _searchBox2.default)({ container: container, queryHook: queryHook });
        simulateInputEvent('come.on.', 'tes', widget, helper, state, container);
        expect(helper.setQuery).toHaveBeenLastCalledWith('hi mom!');
      });
    });
  });

  describe('keyup', function () {
    beforeEach(function () {
      container = document.body.appendChild(document.createElement('input'));
    });

    describe('instant search', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container });
      });

      it('do not perform the search on keyup event (should be done by input event)', function () {
        simulateKeyUpEvent({}, widget, helper, state, container);
        expect(helper.search).not.toHaveBeenCalled();
      });
    });

    describe('non-instant search', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container, searchOnEnterKeyPressOnly: true });
        helper.state.query = 'tes';
        widget.init({ state: helper.state, helper: helper, onHistoryChange: onHistoryChange });
      });

      it('performs the search on keyup if <ENTER>', function () {
        // simulateInputEvent('test', 'tes', widget, helper, state, container);
        // simulateKeyUpEvent({keyCode: 13}, widget, helper, state, container);
        container.value = 'test';
        var e1 = new window.Event('input');
        container.dispatchEvent(e1);

        expect(helper.setQuery).toHaveBeenCalledTimes(1);
        expect(helper.search).toHaveBeenCalledTimes(0);

        // setQuery is mocked and does not apply the modification of the helper
        // we have to set it ourselves
        helper.state.query = container.value;

        var e2 = new window.Event('keyup', { keyCode: 13 });
        Object.defineProperty(e2, 'keyCode', { get: function get() {
            return 13;
          } });
        container.dispatchEvent(e2);

        expect(helper.setQuery).toHaveBeenCalledTimes(1);
        expect(helper.search).toHaveBeenCalledTimes(1);
      });

      it("doesn't perform the search on keyup if not <ENTER>", function () {
        container.value = 'test';
        var event = new window.Event('keyup', { keyCode: 42 });
        Object.defineProperty(event, 'keyCode', { get: function get() {
            return 42;
          } });
        container.dispatchEvent(event);

        expect(helper.setQuery).toHaveBeenCalledTimes(0);
        expect(helper.search).toHaveBeenCalledTimes(0);
      });
    });
  });

  it('updates the input on history update', function () {
    var cb = void 0;
    container = document.body.appendChild(document.createElement('input'));
    widget = (0, _searchBox2.default)({ container: container });
    widget.init({
      state: state,
      helper: helper,
      onHistoryChange: function onHistoryChange(fn) {
        cb = fn;
      }
    });
    expect(container.value).toBe('');
    container.blur();
    cb({ query: 'iphone' });
    expect(container.value).toBe('iphone');
  });

  it('handles external updates', function () {
    container = document.body.appendChild(document.createElement('input'));
    container.value = 'initial';
    widget = (0, _searchBox2.default)({ container: container });
    widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
    container.blur();
    widget.render({
      helper: { state: { query: 'new value' } },
      searchMetadata: { isSearchStalled: false }
    });
    expect(container.value).toBe('new value');
  });

  it('does not update the input value when focused', function () {
    var input = document.createElement('input');
    container = document.body.appendChild(input);
    container.value = 'initial';
    widget = (0, _searchBox2.default)({ container: container });
    widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
    input.focus();
    widget.render({
      helper: { state: { query: 'new value' } },
      searchMetadata: { isSearchStalled: false }
    });
    expect(container.value).toBe('initial');
  });

  describe('autofocus', function () {
    beforeEach(function () {
      container = document.body.appendChild(document.createElement('input'));
      container.focus = jest.fn();
      container.setSelectionRange = jest.fn();
    });

    describe('when auto', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container, autofocus: 'auto' });
      });

      it('is called if search is empty', function () {
        // Given
        helper.state.query = '';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).toHaveBeenCalled();
      });

      it('is not called if search is not empty', function () {
        // Given
        helper.state.query = 'foo';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).not.toHaveBeenCalled();
      });
    });

    describe('when true', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container, autofocus: true });
      });

      it('is called if search is empty', function () {
        // Given
        helper.state.query = '';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).toHaveBeenCalled();
      });

      it('is called if search is not empty', function () {
        // Given
        helper.state.query = 'foo';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).toHaveBeenCalled();
      });

      it('forces cursor to be at the end of the query', function () {
        // Given
        helper.state.query = 'foo';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.setSelectionRange).toHaveBeenLastCalledWith(3, 3);
      });
    });

    describe('when false', function () {
      beforeEach(function () {
        widget = (0, _searchBox2.default)({ container: container, autofocus: false });
      });

      it('is not called if search is empty', function () {
        // Given
        helper.state.query = '';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).not.toHaveBeenCalled();
      });

      it('is not called if search is not empty', function () {
        // Given
        helper.state.query = 'foo';
        // When
        widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
        // Then
        expect(container.focus).not.toHaveBeenCalled();
      });
    });
  });
});

function simulateKeyUpEvent(args, widget, helper, state, container) {
  // Given
  helper.state.query = 'foo';
  // When
  widget.init({ state: state, helper: helper, onHistoryChange: onHistoryChange });
  // Then
  var event = new window.Event('keyup', args);
  Object.defineProperty(event, 'keyCode', { get: function get() {
      return args.keyCode;
    } });
  container.dispatchEvent(event);
}

// eslint-disable-next-line max-params
function simulateInputEvent(query, stateQuery, widget, helper, state, container) {
  if (query === undefined) {
    query = 'test';
  }

  // Given
  if (stateQuery !== undefined) {
    helper.state.query = stateQuery;
  } else {
    helper.state.query = 'tes';
  }

  // When
  widget.init({ state: helper.state, helper: helper, onHistoryChange: onHistoryChange });

  // Then
  container.value = query;
  var event = new window.Event('input');
  container.dispatchEvent(event);
}