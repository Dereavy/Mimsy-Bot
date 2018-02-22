'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Either = require('data.either');

var _require = require('control.monads'),
    liftM2 = _require.liftM2;

/*
 * TODO: Add config value to disable replies
 */

var parseCommentRenderer = require('./parse-comment-renderer');
var parseReplies = require('./parse-replies');

var _require2 = require('./utils/cheerio-utils'),
    cheerioFind = _require2.cheerioFind,
    cheerioAttr = _require2.cheerioAttr;

var _require3 = require('./utils/string-utils'),
    regExec = _require3.regExec,
    regMatch = _require3.regMatch,
    strToInt = _require3.strToInt,
    strTrim = _require3.strTrim;

var getCommentRenderer = function getCommentRenderer($commentThread) {
  return cheerioFind($commentThread, '.comment-thread-renderer > .comment-renderer:nth-child(1)');
};

var getRepliesRenderer = function getRepliesRenderer($commentThread) {
  return cheerioFind($commentThread, '.comment-replies-renderer');
};

var hasReplies = function hasReplies($commentThread) {
  return cheerioFind($commentThread, '.comment-replies-renderer > div').fold(function (_) {
    return false;
  }, function (_) {
    return true;
  });
};

var areRepliesCollapsed = function areRepliesCollapsed($repliesContainer) {
  return cheerioFind($repliesContainer, '.yt-uix-expander-collapsed').fold(function (_) {
    return false;
  }, function (_) {
    return true;
  });
};

var extractRepliesToken = function extractRepliesToken($repliesRenderer) {
  return cheerioFind($repliesRenderer, '.load-more-button').chain(function ($e) {
    return cheerioAttr($e, 'data-uix-load-more-post-body');
  }).map(strTrim).map(function (t) {
    return t.replace(/^page_token=/i, '');
  }).map(function (t) {
    return decodeURIComponent(t);
  });
};

var addRepliesInfo = function addRepliesInfo(comment, $repliesRenderer) {
  return extractRepliesToken($repliesRenderer).map(function (repliesToken) {
    return { hasReplies: true, repliesToken: repliesToken };
  }).map(function (r) {
    return _extends({}, comment, r);
  });
};

var parseCommentReplies = function parseCommentReplies(comment, $repliesRenderer) {
  return parseReplies($repliesRenderer).map(function (replies) {
    return _extends({}, comment, {
      hasReplies: true,
      numReplies: replies.length,
      replies: replies
    });
  });
};

var addReplies = function addReplies(comment, $commentThread) {
  return getRepliesRenderer($commentThread).chain(function ($repliesRenderer) {
    return areRepliesCollapsed($repliesRenderer) ? // if collapsed, extract replies info so we can fetch them later
    addRepliesInfo(comment, $repliesRenderer) : // if not collapsed, parse the replies
    parseCommentReplies(comment, $repliesRenderer);
  });
};

var parseCommentThread = function parseCommentThread($commentThread) {
  return Either.fromNullable($commentThread).leftMap(function (_) {
    return '$commentThread parameter must be defined';
  }).chain(getCommentRenderer).chain(parseCommentRenderer).chain(function (c) {
    return hasReplies($commentThread) ? addReplies(c, $commentThread) : Either.of(_extends({}, c, { hasReplies: false }));
  });
};

module.exports = parseCommentThread;