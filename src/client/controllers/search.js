var youtube = require('youtube-feeds')
, _ = require('underscore');

/**
 * @class Server.controller.SearchController
 */
 var SearchController = {};

/**
 * @property {String}
 */
 SearchController.Test = "asfas";

/**
 * route /search
 *
 * @method
 */
SearchController.Search = function(req, res) {

  var limit = 25,
  start = 1;

  if (req.query.start) {
    start = req.query.start;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (start <= 0) {
    start = 1;
  }

  youtube.feeds.videos({
    'q': req.query.q,
    'max-results': limit,
    'start-index': start,
    orderby: 'relevance'
  }, function(err, data) {
    res.end(JSON.stringify({
      data: data.items
    }));
  });
};


module.exports = function(app) {
  app.get('/search', SearchController.Search);
};