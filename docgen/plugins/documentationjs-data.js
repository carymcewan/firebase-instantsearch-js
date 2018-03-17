'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref) {
  var rootJSFile = _ref.rootJSFile;

  return function documentationjs(files, metalsmith, done) {
    console.log('before documentationjs');
    var out = _documentation2.default.build(rootJSFile, {}).then(function (symbols) {
      // transform all md like structure to html --> type: 'root' using formatMD
      var mdFormattedSymbols = formatAllMD(symbols);

      mapInstantSearch([findInstantSearchFactory(mdFormattedSymbols), findInstantSearch(mdFormattedSymbols)], mdFormattedSymbols, files);
      mapConnectors(filterSymbolsByType('Connector', mdFormattedSymbols), mdFormattedSymbols, files), mapWidgets(filterSymbolsByType('WidgetFactory', mdFormattedSymbols), mdFormattedSymbols, files), metalsmith.metadata().widgetSymbols = groupSymbolsByCategories(filterSymbolsByType('WidgetFactory', mdFormattedSymbols));

      console.log('after documentationjs');
      done();
    }, function (e) {
      return done;
    });
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _documentation = require('documentation');

var _documentation2 = _interopRequireDefault(_documentation);

var _remark = require('remark');

var _remark2 = _interopRequireDefault(_remark);

var _mdRenderer = require('../mdRenderer');

var _mdRenderer2 = _interopRequireDefault(_mdRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var baseDir = _path2.default.resolve(process.cwd(), '..');
function getGithubSource(symbol) {
  return symbol.context.file.split(baseDir)[1].substring(1);
}

function formatMD(ast) {
  if (ast && ast.type === 'root') {
    // 1. extract the raw markdown string from the remark AST
    // 2. use our custom markdown renderer
    return _mdRenderer2.default.render((0, _remark2.default)().stringify(ast));
  }
  return ast;
};

function formatAllMD(symbols) {
  if ((0, _lodash.isArray)(symbols)) {
    return symbols.map(function (s) {
      return formatAllMD(s);
    });
  } else if ((0, _lodash.isObject)(symbols)) {
    return (0, _lodash.reduce)(symbols, function (acc, propertyValue, propertyName) {
      if (propertyName === 'description') {
        acc[propertyName] = formatMD(propertyValue);
      } else if (propertyName === 'sees') {
        acc[propertyName] = propertyValue.map(function (s) {
          return formatMD(s);
        });
      } else {
        acc[propertyName] = formatAllMD(propertyValue);
      }
      return acc;
    }, {});
  }
  return symbols;
}

function findInstantSearch(symbols) {
  return (0, _lodash.filter)(symbols, function (s) {
    return s.name === 'InstantSearch';
  })[0];
}

function findInstantSearchFactory(symbols) {
  return (0, _lodash.filter)(symbols, function (s) {
    return s.name === 'instantsearch';
  })[0];
}

function filterSymbolsByType(type, symbols) {
  return (0, _lodash.filter)(symbols, function (s) {
    var index = (0, _lodash.findIndex)(s.tags, function (t) {
      return t.title === 'type' && t.type.name === type;
    });
    return index !== -1;
  });
}

function groupSymbolsByCategories(symbols) {
  return (0, _lodash.groupBy)(symbols, function (s) {
    var _filter = (0, _lodash.filter)(s.tags, { title: 'category' }),
        _filter2 = _slicedToArray(_filter, 1),
        tag = _filter2[0];

    return tag && tag.description || 'other';
  });
}

function mapInstantSearch(_ref2, symbols, files) {
  var _ref3 = _slicedToArray(_ref2, 2),
      instantsearchFactory = _ref3[0],
      InstantSearch = _ref3[1];

  var fileName = 'instantsearch.html';

  files[fileName] = {
    mode: '0764',
    contents: '',
    title: instantsearchFactory.name,
    layout: 'instantsearch.pug',
    category: 'instantsearch',
    navWeight: 1,
    instantsearchFactory: _extends({}, instantsearchFactory, {
      relatedTypes: findRelatedTypes(instantsearchFactory, symbols)
    }),
    InstantSearch: _extends({}, InstantSearch, {
      relatedTypes: findRelatedTypes(InstantSearch, symbols)
    }),
    withHeadings: true,
    editable: true,
    githubSource: getGithubSource(InstantSearch)
  };
}

function mapConnectors(connectors, symbols, files) {
  return (0, _lodash.forEach)(connectors, function (symbol) {
    var fileName = 'connectors/' + symbol.name + '.html';

    var relatedTypes = findRelatedTypes(symbol, symbols);
    var staticExamples = symbol.tags.filter(function (t) {
      return t.title === 'staticExample';
    });

    var symbolWithRelatedType = _extends({}, symbol, {
      relatedTypes: relatedTypes,
      staticExamples: staticExamples
    });

    files[fileName] = {
      mode: '0764',
      contents: '',
      title: symbol.name,
      mainTitle: 'connectors',
      layout: 'connector.pug',
      category: 'connectors',
      navWeight: 1,
      jsdoc: symbolWithRelatedType,
      withHeadings: true,
      editable: true,
      githubSource: getGithubSource(symbolWithRelatedType)
    };
  });
}

function mapWidgets(widgets, symbols, files) {
  return (0, _lodash.forEach)(widgets, function (symbol) {
    var fileName = 'widgets/' + symbol.name + '.html';

    var relatedTypes = findRelatedTypes(symbol, symbols);
    var staticExamples = symbol.tags.filter(function (t) {
      return t.title === 'staticExample';
    });
    var requirements = symbol.tags.find(function (t) {
      return t.title === 'requirements';
    }) || { description: '' };
    var devNovel = symbol.tags.find(function (t) {
      return t.title === 'devNovel';
    }) || false;

    var symbolWithRelatedType = _extends({}, symbol, {
      requirements: _mdRenderer2.default.render(requirements.description),
      devNovel: createDevNovelURL(devNovel),
      relatedTypes: relatedTypes,
      staticExamples: staticExamples
    });

    files[fileName] = {
      mode: '0764',
      contents: '',
      title: symbol.name,
      mainTitle: 'widgets',
      layout: 'widget.pug',
      category: 'widgets',
      navWeight: 1,
      jsdoc: symbolWithRelatedType,
      withHeadings: true,
      editable: true,
      githubSource: getGithubSource(symbolWithRelatedType)
    };
  });
}

function findRelatedTypes(functionSymbol, symbols) {
  var types = [];
  if (!functionSymbol) return types;

  var findParamsTypes = function findParamsTypes(p) {
    if (!p || !p.type) return;
    var currentParamType = p.type.type;
    if (currentParamType === 'FunctionType') {
      types = [].concat(_toConsumableArray(types), _toConsumableArray(findRelatedTypes(p.type, symbols)));
    } else if (currentParamType === 'UnionType') {
      (0, _lodash.forEach)(p.type.elements, function (e) {
        findParamsTypes({ name: e.name, type: e });
      });
    } else if (currentParamType === 'OptionalType') {
      findParamsTypes({ name: p.type.expression.name, type: p.type.expression });
    } else if (currentParamType === 'TypeApplication') {
      var applications = p.type.applications;
      if (applications && applications.length > 0) applications.forEach(function (a) {
        findParamsTypes({ name: a.name, type: a });
      });
    } else if (p.name === '$0') {
      var unnamedParameterType = p.type.name;
      var typeSymbol = (0, _lodash.find)(symbols, { name: unnamedParameterType });
      types = [].concat(_toConsumableArray(types), [typeSymbol], _toConsumableArray(findRelatedTypes(typeSymbol, symbols)));
    } else {
      if (isCustomType(p.name)) {
        var _typeSymbol = (0, _lodash.find)(symbols, { name: p.name });
        if (!_typeSymbol) console.warn('Undefined type: ', p.name);else {
          types = [].concat(_toConsumableArray(types), [_typeSymbol]);
          // iterate over each property to get their types
          (0, _lodash.forEach)(_typeSymbol.properties, function (p) {
            return findParamsTypes({ name: p.type.name, type: p.type });
          });
        }
      } else if (isCustomType(p.type.name)) {
        var _typeSymbol2 = (0, _lodash.find)(symbols, { name: p.type.name });
        if (!_typeSymbol2) console.warn('Undefined type: ', p.type.name);else {
          types = [].concat(_toConsumableArray(types), [_typeSymbol2]);
          // iterate over each property to get their types
          if (_typeSymbol2.properties) (0, _lodash.forEach)(_typeSymbol2.properties, function (p2) {
            return findParamsTypes({ name: p2.type.name, type: p2.type });
          });
        }
      }
    }
  };

  (0, _lodash.forEach)(functionSymbol.params, findParamsTypes);
  (0, _lodash.forEach)(functionSymbol.returns, findParamsTypes);
  (0, _lodash.forEach)(functionSymbol.properties, findParamsTypes);

  return (0, _lodash.uniqBy)(types, 'name');
}

function isCustomType(name) {
  return name && name !== 'Object' && name[0] === name[0].toUpperCase();
}

function createDevNovelURL(devNovel) {
  return devNovel ? 'dev-novel?selectedStory=' + devNovel.description + '.default' : '';
}