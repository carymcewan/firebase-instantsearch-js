'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('Breadcrumb'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '\n        <div id="hierarchicalMenu"></div>\n        <div id="breadcrumb"></div>\n      ';

    window.search.addWidget(_index2.default.widgets.breadcrumb({
      container: '#breadcrumb',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']
    }));

    // Custom Widget to toggle refinement
    window.search.addWidget({
      init: function init(_ref) {
        var helper = _ref.helper;

        helper.toggleRefinement('hierarchicalCategories.lvl0', 'Cameras & Camcorders > Digital Cameras');
      }
    });
  })).add('with custom home label', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '\n        <div id="hierarchicalMenu"></div>\n        <div id="breadcrumb"></div>\n      ';

    window.search.addWidget(_index2.default.widgets.breadcrumb({
      container: '#breadcrumb',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      templates: { home: 'Home Page' }
    }));

    // Custom Widget to toggle refinement
    window.search.addWidget({
      init: function init(_ref2) {
        var helper = _ref2.helper;

        helper.toggleRefinement('hierarchicalCategories.lvl0', 'Cameras & Camcorders > Digital Cameras');
      }
    });
  })).add('with default selected item', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '\n        <div id="breadcrumb"></div>\n        <div id="hierarchicalMenu"></div>\n      ';

    window.search.addWidget(_index2.default.widgets.breadcrumb({
      container: '#breadcrumb',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders > Digital Cameras'
    }));

    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      showParentLevel: false,
      container: '#hierarchicalMenu',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders'
    }));
  })).add('with hierarchical menu', (0, _wrapWithHits.wrapWithHits)(function (container) {
    container.innerHTML = '\n        <div id="breadcrumb"></div>\n        <div id="hierarchicalMenu"></div>\n      ';

    window.search.addWidget(_index2.default.widgets.breadcrumb({
      container: '#breadcrumb',
      separator: ' / ',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']
    }));

    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      showParentLevel: false,
      container: '#hierarchicalMenu',
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders'
    }));
  }));
};