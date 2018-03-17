'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = highlight;

var _runmode = require('codemirror/addon/runmode/runmode.node');

require('codemirror/mode/groovy/groovy');

require('codemirror/mode/xml/xml');

require('codemirror/mode/diff/diff');

require('codemirror/mode/clike/clike');

require('codemirror/mode/jsx/jsx');

require('codemirror/mode/htmlmixed/htmlmixed');

require('codemirror/mode/javascript/javascript');

require('codemirror/mode/shell/shell');

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function highlight(source) {
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'javascript';
  var inline = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var runnable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var inlineClassNames = ['CodeMirror', 'cm-s-mdn-like'];
  var blockClassNames = [].concat(inlineClassNames, ['code-sample']);

  if (runnable) {
    blockClassNames.push('code-sample-runnable');
  }

  if (lang === 'html') {
    lang = 'htmlmixed';
  }

  var output = '';
  (0, _runmode.runMode)(source, lang, function (text, style) {
    text = (0, _escapeHtml2.default)(text);
    if (!style) {
      output += text;
      return;
    }
    var className = style.split(' ').map(function (s) {
      return 'cm-' + s;
    }).join(' ');
    output += '<span class="' + className + '">' + text + '</span>';
  });

  if (inline) {
    return '<code class="' + inlineClassNames.join(' ') + '">' + output + '</code>';
  }

  return '<pre class="' + blockClassNames.join(' ') + '"><code>' + output + '</code></pre>';
}