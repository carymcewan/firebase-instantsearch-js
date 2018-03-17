'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearAll = clearAll;
exports.prepareScreenshot = prepareScreenshot;
function clearAll() {
  // clear-all click seems tricky in some browsers
  browser.click('#clear-all a');
  browser.pause(500);
}

var searchBox = exports.searchBox = {
  selector: '#search-box',
  set: function set(query) {
    return browser.setValue('#search-box', query);
  },
  clear: function clear() {
    return browser.clearElement('#search-box');
  },
  get: function get() {
    return browser.getValue('#search-box');
  }
};

function blurAll() {
  if ('activeElement' in document) {
    document.activeElement.blur();
  }
}

function prepareScreenshot() {
  // The focus bar visibility is flaky.
  return browser.execute(blurAll);
}