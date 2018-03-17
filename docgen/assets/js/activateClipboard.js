'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = activateClipboard;

var _clipboard = require('clipboard');

var _clipboard2 = _interopRequireDefault(_clipboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function activateClipboard(codeSamples) {
  codeSamples.forEach(function (codeSample) {
    var cleanAfter = 800;
    var timeout = void 0;
    var copyToClipboard = document.createElement('button');

    var setup = function setup() {
      clearTimeout(timeout);
      copyToClipboard.innerHTML = '<span class="icon icon-copy"><svg><use xlink:href="#icon-copy" /></svg></span>';
      copyToClipboard.setAttribute('title', 'copy');
      copyToClipboard.classList.remove('clipboard-done');
      copyToClipboard.classList.add('clipboard');
    };

    var done = function done() {
      copyToClipboard.classList.add('clipboard-done');
      copyToClipboard.textContent = 'Copied!';
    };

    var clipboard = new _clipboard2.default(copyToClipboard, {
      text: function text() {
        return codeSample.querySelector('code').textContent;
      }
    });

    setup();

    var heading = document.createElement('div');
    heading.className = 'heading';
    heading.innerHTML = 'Code';
    heading.appendChild(copyToClipboard);
    codeSample.parentNode.insertBefore(heading, codeSample);

    copyToClipboard.addEventListener('mouseleave', setup, true);
    clipboard.on('success', function () {
      done();
      timeout = setTimeout(setup, cleanAfter);
    });
  });
}