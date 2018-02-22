'use strict';

var Either = require('data.either');

var _require = require('./utils/cheerio-utils'),
    cheerio = _require.cheerio;

var tokenizeComments = function tokenizeComments(html) {
  return Either.fromNullable(cheerio.load(html)).map(function ($) {
    return $('.comment-thread-renderer').toArray();
  }).map(function (cs) {
    return cs.map(cheerio);
  });
};

module.exports = tokenizeComments;