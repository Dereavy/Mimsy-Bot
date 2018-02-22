'use strict';

var Either = require('data.either');

var parseCommentRenderer = require('./parse-comment-renderer');
var traverse = require('./utils/traverse-array');

var _require = require('./utils/cheerio-utils'),
    cheerioFindAll = _require.cheerioFindAll;

var parseReplies = function parseReplies($replies) {
  return cheerioFindAll($replies, '.comment-renderer').chain(function ($commentRenderers) {
    return traverse($commentRenderers, Either.of, parseCommentRenderer);
  });
};

module.exports = parseReplies;