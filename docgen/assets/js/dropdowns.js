'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function dropdowns() {
  var openDropdown = document.querySelectorAll('[data-toggle-dropdown]');
  var otherDropdown = document.querySelectorAll('.simple-dropdown');

  for (var i = 0; i < openDropdown.length; i++) {
    toggleDropdown(openDropdown[i]);
  }

  function toggleDropdown(element) {
    var dropdown = element.getAttribute('data-toggle-dropdown');
    var theDropdown = document.getElementById(dropdown);
    element.addEventListener('click', function () {
      if (!theDropdown.classList.contains('opened')) {
        for (var _i = 0; _i < otherDropdown.length; _i++) {
          otherDropdown[_i].classList.remove('opened');
        }

        theDropdown.classList.add('opened');
        theDropdown.setAttribute('aria-expanded', 'true');
        theDropdown.setAttribute('aria-expanded', 'true');
      } else {
        theDropdown.classList.remove('opened');
        theDropdown.setAttribute('aria-expanded', 'false');
        theDropdown.setAttribute('aria-expanded', 'false');
      }
    });

    // When there is a click event
    // Check if the clicked element is the
    // dropdown toggler, if not, close the dropdown
    document.body.addEventListener('click', function (e) {
      if (e.target !== element) {
        theDropdown.classList.remove('opened');
      }
    });
  }
}

exports.default = dropdowns;