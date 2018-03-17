'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _index2.default.connectors.connectMenu(customMenuRendering); /* eslint-disable import/default */
/* global $ */

function customMenuRendering(opts, isFirstRendering) {
  var container = opts.widgetParams.containerNode;

  var input = void 0;
  if (isFirstRendering) {
    input = $('<select></select>');
    input.refine = opts.refine;
    input.on('change', function (e) {
      input.refine(e.target.value);
    });
    container.html('<div class="ais-toggle--header facet-title ais-header">Custom categories</div>').append(input);
  } else {
    input = container.find('select');
  }

  input.refine = opts.refine;

  var facetValues = opts.items.slice(0, opts.widgetParams.limit || 10);
  var facetOptions = facetValues.map(function (f) {
    return f.isRefined ? $('<option value=\'' + f.value + '\' selected>' + f.label + '</option>') : $('<option value=\'' + f.value + '\'>' + f.label + '</option>');
  });
  var isValueSelected = facetValues.find(function (f) {
    return f.isRefined;
  });

  var noValue = $('<option value=\'\' selected=\'' + !isValueSelected + '\'></option>');

  input.html('');

  input.append(noValue);
  if (facetOptions.length > 0) {
    facetOptions.forEach(function (o) {
      input.append(o);
    });
  }
}