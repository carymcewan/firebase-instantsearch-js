'use strict';

var _escapeHighlight = require('../escape-highlight');

var _escapeHighlight2 = _interopRequireDefault(_escapeHighlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('escapeHits()', function () {
  it('should escape highlightProperty simple text value', function () {
    var hits = [{
      _highlightResult: {
        foobar: {
          value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
        }
      },
      _snippetResult: {
        foobar: {
          value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
        }
      }
    }];

    var output = [{
      _highlightResult: {
        foobar: {
          value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
        }
      },
      _snippetResult: {
        foobar: {
          value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
        }
      }
    }];

    output.__escaped = true;
    expect((0, _escapeHighlight2.default)(hits)).toEqual(output);
  });

  it('should escape highlightProperty nested object value', function () {
    var hits = [{
      _highlightResult: {
        foo: {
          bar: {
            value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
          }
        }
      },
      _snippetResult: {
        foo: {
          bar: {
            value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
          }
        }
      }
    }];

    var output = [{
      _highlightResult: {
        foo: {
          bar: {
            value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
          }
        }
      },
      _snippetResult: {
        foo: {
          bar: {
            value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
          }
        }
      }
    }];

    output.__escaped = true;
    expect((0, _escapeHighlight2.default)(hits)).toEqual(output);
  });

  it('should escape highlightProperty array of string', function () {
    var hits = [{
      _highlightResult: {
        foobar: [{
          value: '<script>__ais-highlight__bar__/ais-highlight__</script>'
        }, {
          value: '<script>__ais-highlight__foo__/ais-highlight__</script>'
        }]
      },
      _snippetResult: {
        foobar: [{
          value: '<script>__ais-highlight__bar__/ais-highlight__</script>'
        }, {
          value: '<script>__ais-highlight__foo__/ais-highlight__</script>'
        }]
      }
    }];

    var output = [{
      _highlightResult: {
        foobar: [{ value: '&lt;script&gt;<em>bar</em>&lt;/script&gt;' }, { value: '&lt;script&gt;<em>foo</em>&lt;/script&gt;' }]
      },
      _snippetResult: {
        foobar: [{ value: '&lt;script&gt;<em>bar</em>&lt;/script&gt;' }, { value: '&lt;script&gt;<em>foo</em>&lt;/script&gt;' }]
      }
    }];

    output.__escaped = true;
    expect((0, _escapeHighlight2.default)(hits)).toEqual(output);
  });

  it('should escape highlightProperty array of object', function () {
    var hits = [{
      _highlightResult: {
        foobar: [{
          foo: {
            bar: {
              value: '<script>__ais-highlight__bar__/ais-highlight__</script>'
            }
          }
        }, {
          foo: {
            bar: {
              value: '<script>__ais-highlight__foo__/ais-highlight__</script>'
            }
          }
        }]
      },
      _snippetResult: {
        foobar: [{
          foo: {
            bar: {
              value: '<script>__ais-highlight__bar__/ais-highlight__</script>'
            }
          }
        }, {
          foo: {
            bar: {
              value: '<script>__ais-highlight__foo__/ais-highlight__</script>'
            }
          }
        }]
      }
    }];

    var output = [{
      _highlightResult: {
        foobar: [{
          foo: {
            bar: {
              value: '&lt;script&gt;<em>bar</em>&lt;/script&gt;'
            }
          }
        }, {
          foo: {
            bar: {
              value: '&lt;script&gt;<em>foo</em>&lt;/script&gt;'
            }
          }
        }]
      },
      _snippetResult: {
        foobar: [{
          foo: {
            bar: {
              value: '&lt;script&gt;<em>bar</em>&lt;/script&gt;'
            }
          }
        }, {
          foo: {
            bar: {
              value: '&lt;script&gt;<em>foo</em>&lt;/script&gt;'
            }
          }
        }]
      }
    }];
    output.__escaped = true;
    expect((0, _escapeHighlight2.default)(hits)).toEqual(output);
  });

  it('should not escape twice the same results', function () {
    var hits = [{
      _highlightResult: {
        foobar: {
          value: '<script>__ais-highlight__foo__/ais-highlight__</script>'
        }
      }
    }];

    hits = (0, _escapeHighlight2.default)(hits);
    hits = (0, _escapeHighlight2.default)(hits);

    var output = [{
      _highlightResult: {
        foobar: {
          value: '&lt;script&gt;<em>foo</em>&lt;/script&gt;'
        }
      }
    }];

    output.__escaped = true;

    expect(hits).toEqual(output);
  });
});