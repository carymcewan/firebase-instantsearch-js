'use strict';

var _dropdowns = require('./dropdowns.js');

var _dropdowns2 = _interopRequireDefault(_dropdowns);

var _mover = require('./mover.js');

var _mover2 = _interopRequireDefault(_mover);

var _activateClipboard = require('./activateClipboard.js');

var _activateClipboard2 = _interopRequireDefault(_activateClipboard);

var _bindRunExamples = require('./bindRunExamples.js');

var _bindRunExamples2 = _interopRequireDefault(_bindRunExamples);

var _fixSidebar = require('./fix-sidebar.js');

require('../../../src/css/instantsearch.scss');

require('../../../src/css/instantsearch-theme-algolia.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var alg = require('algolia-frontend-components/javascripts.js');

var docSearch = {
  apiKey: '64eb3d69b6fb84f3c04a24224b6268a7',
  indexName: 'instantsearchjs-v2',
  inputSelector: '#searchbox'
};

var header = new alg.communityHeader(docSearch);

var container = document.querySelector('.documentation-container');
var codeSamples = document.querySelectorAll('.code-sample');
var codeSamplesRunnable = document.querySelectorAll('.code-sample-runnable');

(0, _dropdowns2.default)();
(0, _mover2.default)();
(0, _activateClipboard2.default)(codeSamples);
(0, _bindRunExamples2.default)(codeSamplesRunnable);

var sidebarContainer = document.querySelector('.sidebar');
if (sidebarContainer) {
  var headerHeight = document.querySelector('.algc-navigation').getBoundingClientRect().height;
  var contentContainer = document.querySelector('.documentation-container');
  (0, _fixSidebar.fixSidebar)({ sidebarContainer: sidebarContainer, topOffset: headerHeight });
  (0, _fixSidebar.followSidebarNavigation)(sidebarContainer.querySelectorAll('a'), contentContainer.querySelectorAll('h2'));
}

// The Following function will make the '.sidebar-opener'
// clickable and it will open/close the sidebar on the
// documentations

function toggleDocumentationSidebar() {
  var sidebarNav = document.querySelector('nav.sidebar');
  var trigger = document.querySelector('.sidebar-opener');

  function init() {
    var bodySize = document.body.clientWidth;
    if (bodySize <= 960 && sidebarNav) {
      trigger.addEventListener('click', function () {
        sidebarNav.classList.toggle('Showed');
        trigger.classList.toggle('Showed');
      });
    }
  }
  init();
}
toggleDocumentationSidebar();

window.addEventListener('resize', function () {
  toggleDocumentationSidebar();
});