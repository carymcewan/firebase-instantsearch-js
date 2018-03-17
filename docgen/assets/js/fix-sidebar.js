'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixSidebar = fixSidebar;
exports.followSidebarNavigation = followSidebarNavigation;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Fixes a sidebar in the boundaries of its parent
 * @param {object} $0 options to init the fixed sidebar
 * @param {HTMLElement} $0.sidebarContainer the holder of the menu
 * @param {topOffset} $0.topOffset an optional top offset for sticky menu
 */
function fixSidebar(_ref) {
  var sidebarContainer = _ref.sidebarContainer,
      topOffset = _ref.topOffset;

  var siderbarParent = sidebarContainer.parentElement;
  var boundaries = getStartStopBoundaries(siderbarParent, sidebarContainer, topOffset);

  siderbarParent.style.position = 'relative';

  var positionSidebar = function positionSidebar() {
    var currentScroll = window.pageYOffset;
    var _boundaries = boundaries,
        start = _boundaries.start,
        stop = _boundaries.stop;

    if (currentScroll > start) {
      if (currentScroll > stop) {
        sidebarContainer.style.position = 'absolute';
        sidebarContainer.style.bottom = '0';
        sidebarContainer.classList.remove('fixed');
      } else {
        sidebarContainer.style.position = null;
        sidebarContainer.style.bottom = null;
        sidebarContainer.classList.add('fixed');
      }
    } else {
      sidebarContainer.classList.remove('fixed');
    }
  };

  var updateBoundaries = function updateBoundaries() {
    boundaries = getStartStopBoundaries(siderbarParent, sidebarContainer, topOffset);
  };

  window.addEventListener('load', updateBoundaries);
  document.addEventListener('DOMContentLoaded', updateBoundaries);

  document.addEventListener('scroll', positionSidebar);

  window.updateBoundaries = updateBoundaries; // DOES NOT WORK :(

  updateBoundaries();
  positionSidebar();
}

/**
 * Defines the limits where to start or stop the stickiness
 * @param {HTMLElement} parent the outer container of the sidebar
 * @param {HTMLElement} sidebar the sidebar
 * @param {number} topOffset an optional top offset for sticky menu
 */
function getStartStopBoundaries(parent, sidebar, topOffset) {
  var bbox = parent.getBoundingClientRect();
  var sidebarBbox = sidebar.getBoundingClientRect();
  var bodyBbox = document.body.getBoundingClientRect();

  var containerAbsoluteTop = bbox.top - bodyBbox.top;
  var sidebarAbsoluteTop = sidebarBbox.top - bodyBbox.top;
  var marginTop = sidebarAbsoluteTop - containerAbsoluteTop;
  var start = containerAbsoluteTop - topOffset;
  var stop = bbox.height + containerAbsoluteTop - sidebarBbox.height - marginTop - topOffset;

  return {
    start: start,
    stop: stop
  };
}

function followSidebarNavigation(sidebarLinks, contentHeaders) {
  var links = [].concat(_toConsumableArray(sidebarLinks));
  var headers = [].concat(_toConsumableArray(contentHeaders));

  var setActiveSidebarLink = function setActiveSidebarLink(header) {
    links.forEach(function (item) {
      var currentHref = item.getAttribute('href');
      var anchorToFind = '#' + header.getAttribute('id');
      var isCurrentHeader = currentHref.indexOf(anchorToFind) != -1;
      if (isCurrentHeader) {
        item.classList.add('navItem-active');
      } else {
        item.classList.remove('navItem-active');
      }
    });
  };

  var findActiveSidebarLink = function findActiveSidebarLink() {
    var highestVisibleHeaders = headers.map(function (header) {
      return { element: header, rect: header.getBoundingClientRect() };
    }).filter(function (_ref2) {
      var rect = _ref2.rect;
      return rect.top < window.innerHeight / 3 && rect.bottom < window.innerHeight;
    }
    // top element relative viewport position should be at least 1/3 viewport
    // and element should be in viewport
    )
    // then we take the closest to this position as reference
    .sort(function (header1, header2) {
      return Math.abs(header1.rect.top) < Math.abs(header2.rect.top) ? -1 : 1;
    });

    if (headers[0] && highestVisibleHeaders.length === 0) {
      setActiveSidebarLink(headers[0]);
      return;
    }

    if (highestVisibleHeaders[0]) {
      setActiveSidebarLink(highestVisibleHeaders[0].element);
    }
  };

  findActiveSidebarLink();
  window.addEventListener('load', findActiveSidebarLink);
  document.addEventListener('DOMContentLoaded', findActiveSidebarLink);
  document.addEventListener('scroll', findActiveSidebarLink);
}