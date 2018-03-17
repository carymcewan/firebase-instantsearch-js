'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _index = require('../../../../index');

var _index2 = _interopRequireDefault(_index);

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _devNovel.storiesOf)('HierarchicalMenu'); /* eslint-disable import/default */

exports.default = function () {
  stories.add('default', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      container: container,
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']
    }));
  })).add('only show current level options', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      container: container,
      showParentLevel: false,
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']
    }));
  })).add('with default selected item', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      container: container,
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders'
    }));
  }, {
    searchParameters: {
      hierarchicalFacetsRefinements: {
        'hierarchicalCategories.lvl0': ['Cameras & Camcorders > Digital Cameras']
      }
    }
  })).add('with header', (0, _wrapWithHits.wrapWithHits)(function (container) {
    window.search.addWidget(_index2.default.widgets.hierarchicalMenu({
      container: container,
      attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      rootPath: 'Cameras & Camcorders',
      templates: {
        header: 'Hierarchical categories'
      }
    }));
  }));
};