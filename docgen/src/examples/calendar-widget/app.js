'use strict';

var ONE_DAY_IN_MS = 3600 * 24 * 1000;

var search = instantsearch({
  appId: 'latency',
  apiKey: '059c79ddd276568e990286944276464a',
  indexName: 'concert_events_instantsearchjs'
});

search.addWidget(instantsearch.widgets.searchBox({
  container: '#search-box',
  placeholder: 'Search events'
}));

search.addWidget(instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: function item(hit) {
      return '\n        <li class="hit">\n          <h3>\n            ' + hit._highlightResult.name.value + '\n            <small>in ' + hit._highlightResult.location.value + '</small>\n          </h3>\n          <small>on <strong>' + moment(hit.date).format('dddd MMMM Do YYYY') + '</strong></small>\n        </li>\n      ';
    }
  }
}));

var makeRangeWidget = instantsearch.connectors.connectRange(function (options, isFirstRendering) {
  if (!isFirstRendering) return;

  var refine = options.refine;


  new Calendar({
    element: $('#calendar'),
    same_day_range: true,
    callback: function callback() {
      var start = new Date(this.start_date).getTime();
      var end = new Date(this.end_date).getTime();
      var actualEnd = start === end ? end + ONE_DAY_IN_MS - 1 : end;

      refine([start, actualEnd]);
    },
    // Some good parameters based on our dataset:
    start_date: new Date(),
    end_date: new Date('01/01/2020'),
    earliest_date: new Date('01/01/2008'),
    latest_date: new Date('01/01/2020')
  });
});

var dateRangeWidget = makeRangeWidget({
  attributeName: 'date'
});

search.addWidget(dateRangeWidget);

search.start();