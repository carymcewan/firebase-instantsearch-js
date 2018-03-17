"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = bindRunExamples;

var _main = require("../../../src/lib/main.js");

var _main2 = _interopRequireDefault(_main);

var _capitalize = require("lodash/capitalize");

var _capitalize2 = _interopRequireDefault(_capitalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.instantsearch = _main2.default;
window.search = (0, _main2.default)(_extends({
  appId: "latency",
  apiKey: "6be0576ff61c053d5f9a3225e2a90f76",
  indexName: "instant_search",
  urlSync: false,
  searchParameters: {
    hitsPerPage: 3
  }
}, window.searchConfig));

var el = function el(html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  return div;
};

function initWidgetExample(codeSample, index) {
  var state = { IS_RUNNING: false };

  var _$exec = /widgets.(\S+)\(/g.exec(codeSample.lastChild.innerText),
      _$exec2 = _slicedToArray(_$exec, 2),
      widgetName = _$exec2[1];

  // container for code sample live example


  var liveExampleContainer = createLiveExampleContainer(widgetName, "widget", index);

  var runExample = function runExample() {
    if (!state.IS_RUNNING) {
      state.IS_RUNNING = true;

      // append widget container before running code
      codeSample.after(liveExampleContainer);

      // replace `container` option with the generated one
      var codeToEval = codeSample.lastChild.innerText.replace(/container: \S+,?/, "container: \"#live-example-" + index + "\",");

      // execute code, display widget
      window.eval(codeToEval);
      appendDefaultSearchWidgets(index);
    }
  };

  appendRunButton(codeSample, runExample);
}

function initConnectorExample(codeSample, index) {
  var state = { IS_RUNNING: false };

  var _$exec3 = /the custom (\S+) widget/g.exec(codeSample.lastChild.innerText),
      _$exec4 = _slicedToArray(_$exec3, 2),
      widgetName = _$exec4[1];

  var liveExampleContainer = createLiveExampleContainer(widgetName, "connector", index);

  var runExample = function runExample() {
    if (!state.IS_RUNNING) {
      state.IS_RUNNING = true;

      codeSample.after(liveExampleContainer);

      var codeToEval = codeSample.lastChild.innerText.replace(/containerNode: \S+,?/, "containerNode: $(\"#live-example-" + index + "\"),");

      window.eval(codeToEval);
      appendDefaultSearchWidgets(index);
    }
  };

  appendRunButton(codeSample, runExample);
}

function createLiveExampleContainer(name, type, index) {
  return el("\n    <div class=\"live-example\">\n      <h3>" + (0, _capitalize2.default)(name) + " " + type + " example</h3>\n      <div id=\"live-example-" + index + "\"></div>\n\n      <div class=\"live-example-helpers\">\n        <h3>SearchBox & Hits</h3>\n        <div id=\"search-box-container-" + index + "\"></div>\n        <div id=\"hits-container-" + index + "\"></div>\n      </div>\n    </div>\n  ");
}

function appendDefaultSearchWidgets(index) {
  // add default searchbox & hits
  search.addWidget(_main2.default.widgets.searchBox({
    container: "#search-box-container-" + index,
    placeholder: "Search for products",
    autofocus: false
  }));

  search.addWidget(_main2.default.widgets.hits({
    container: "#hits-container-" + index,
    templates: {
      empty: "No results",
      item: "<strong>Hit {{objectID}}</strong>: {{{_highlightResult.name.value}}}"
    }
  }));

  search.start();
}

function appendRunButton(codeSample, handler) {
  var runBtn = document.createElement("button");
  runBtn.textContent = "Run";
  runBtn.style.marginRight = "10px";
  runBtn.onclick = handler;

  codeSample.previousSibling.appendChild(runBtn);
}

function bindRunExamples(codeSamples) {
  codeSamples.forEach(function (codeSample, index) {
    var exampleContent = codeSample.lastChild.innerText;

    // initialize examples for widget
    if (exampleContent.indexOf("search.addWidget") === 0) {
      initWidgetExample(codeSample, index);
    }

    // initialize examples for connector, check we have the matching pattern
    if (/function renderFn\(\S+(, isFirstRendering)?\) {/g.test(exampleContent)) {
      initConnectorExample(codeSample, index);
    }
  });
}