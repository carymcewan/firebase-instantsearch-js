'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  return function (files, metalsmith, done) {
    var allFilles = Object.entries(files).reduce(function (memo, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          filename = _ref2[0],
          file = _ref2[1];

      return (/\.jsdoc$/.test(filename) ? [].concat(_toConsumableArray(memo), [_extends({ filename: filename.replace(/\.jsdoc$/, '') }, file)]) : memo
      );
    }, []);

    var filesToParse = allFilles.filter(function (file) {
      return (0, _onlyChanged.hasChanged)(file);
    }).map(function (file) {
      return file.filename;
    });

    if (cachedFiles) {
      // remove any file from cache not present in filestoparse
      Object.entries(cachedFiles).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            buildFilename = _ref4[0],
            file = _ref4[1];

        if (!allFilles.some(function (_ref5) {
          var filename = _ref5.filename;
          return file.filename === filename;
        })) {
          delete cachedFiles[buildFilename];
        } else {
          files[buildFilename] = cachedFiles[buildFilename];
        }
      });
    } else {
      cachedFiles = {};
    }

    allFilles.forEach(function (_ref6) {
      var filename = _ref6.filename;
      return delete files[filename + '.jsdoc'];
    });

    if (filesToParse.length === 0) {
      done();
      return;
    }

    (0, _jsdocParse2.default)({
      src: filesToParse,
      json: true
    }).pipe((0, _collectJson2.default)(dataReady));

    function dataReady(unfilteredSymbols) {
      var symbolsByCategory = (0, _lodash.groupBy)(unfilteredSymbols.filter(function (o) {
        return !o.deprecated && o.kind && (o.kind === 'component' || o.kind === 'widget' || o.kind === 'connector');
      }), 'kind');

      (0, _lodash.forEach)(symbolsByCategory, function (symbols) {
        (0, _lodash.forEach)(symbols, function (data) {
          var buildFilename = data.kind + 's/' + data.name + '.html';
          var customTags = parseCustomTags(data.customTags);
          var isNameUnique = unfilteredSymbols.map(function (s) {
            return s.name;
          }).filter(function (n) {
            return n === data.name;
          }).length === 1;
          var title = isNameUnique ? data.name : data.name + ' ' + data.kind;

          var fileFromMetalsmith = allFilles.find(function (_ref7) {
            var filename = _ref7.filename;
            return filename === (0, _path.join)(data.meta.path, data.meta.filename);
          });

          files[buildFilename] = cachedFiles[buildFilename] = _extends({}, data, customTags, {
            mode: '0764',
            contents: '',
            stats: fileFromMetalsmith && fileFromMetalsmith.stats,
            filename: fileFromMetalsmith && fileFromMetalsmith.filename,
            title: title,
            mainTitle: '' + data.kind.charAt(0).toUpperCase() + data.kind.slice(1) + 's', //
            withHeadings: false,
            layout: data.kind + '.pug',
            category: data.kind,
            navWeight: data.name === 'InstantSearch' ? 1000 : 0
          });
        });
      });

      done();
    }
  };
};

var _collectJson = require('collect-json');

var _collectJson2 = _interopRequireDefault(_collectJson);

var _jsdocParse = require('jsdoc-parse');

var _jsdocParse2 = _interopRequireDefault(_jsdocParse);

var _lodash = require('lodash');

var _onlyChanged = require('./onlyChanged.js');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var cachedFiles = void 0;

/**
 * This regexp aims to parse the following kind of jsdoc tag values:
 *  1 - `{boolean} [showMore=false] - description`
 *  2 - `{boolean} showMore - description`
 * The groups output for 1/ are:
 * [
 *   '{boolean} [showMore=false] - description',
 *   'boolean',
 *   '[',
 *   'showMore',
 *   'false',
 *   'description'
 * ]
 * the first square bracket is  matched in order to detect optional parameter
 */
var typeNameValueDescription = /\{(.+)\} (?:(\[?)(\S+?)(?:=(\S+?))?]? - )?(.+)/;
function parseTypeNameValueDescription(v) {
  var parsed = typeNameValueDescription.exec(v);
  if (!parsed) return null;
  return {
    type: parsed[1],
    isOptional: parsed[2] === '[',
    name: parsed[3],
    defaultValue: parsed[4],
    description: parsed[5]
  };
}

/**
 * This regexp aims to parse simple key description tag values. Example
 *  showMore - container for the show more button
 */
var keyDescription = /(?:(\S+) - )?(.+)/;
function parseKeyDescription(v) {
  var parsed = keyDescription.exec(v);
  if (!parsed) return null;
  return {
    key: parsed[1],
    description: parsed[2]
  };
}

var customTagParsers = {
  proptype: parseTypeNameValueDescription,
  providedproptype: parseTypeNameValueDescription,
  themekey: parseKeyDescription,
  translationkey: parseKeyDescription
};

function parseCustomTags(customTagObjects) {
  if (!customTagObjects) return {};

  var res = {};
  customTagObjects.forEach(function (_ref8) {
    var tag = _ref8.tag,
        value = _ref8.value;

    var tagValueParser = customTagParsers[tag];
    if (!tagValueParser) return;
    res[tag] = res[tag] || [];
    res[tag].push(tagValueParser(value));
  });

  return res;
}