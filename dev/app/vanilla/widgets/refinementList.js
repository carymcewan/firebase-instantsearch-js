'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(_ref, isFirstRendering) {
    var items = _ref.items,
        refine = _ref.refine,
        containerNode = _ref.widgetParams.containerNode;

    var ul = void 0;
    if (isFirstRendering) {
        containerNode.className = 'ais-root ais-refinement-list';

        var header = document.createElement('div');
        header.className = 'ais-refinement-list--header facet-title ais-header';
        header.innerText = 'Brands';
        containerNode.appendChild(header);

        ul = document.createElement('ul');
        ul.className = 'ais-body ais-refinement-list--body';
        containerNode.appendChild(ul);
    } else {
        ul = containerNode.querySelector('ul');
    }

    var elements = items.map(function (item) {
        var li = document.createElement('li');

        var label = document.createElement('label');
        label.className = 'ais-refinement-list--label';
        li.appendChild(label);

        var check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'ais-refinement-list--checkbox';
        if (item.isRefined) check.checked = 'checked';
        label.appendChild(check);

        check.addEventListener('change', function () {
            refine(item.value);
        });

        var span = document.createElement('span');
        span.innerText = item.label;
        label.appendChild(span);

        var count = document.createElement('span');
        count.className = 'ais-refinement-list--count facet-count pull-right';
        count.innerText = item.count;
        label.appendChild(count);

        return li;
    });
    ul.textContent = '';
    elements.forEach(function (el) {
        return ul.appendChild(el);
    });
} /* eslint-disable import/default */
exports.default = _index2.default.connectors.connectRefinementList(render);