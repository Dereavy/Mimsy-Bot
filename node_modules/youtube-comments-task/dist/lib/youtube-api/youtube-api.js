'use strict';

var _require = require('retry-task'),
    delayedRetry = _require.delayedRetry;

var Either = require('data.either');
var Task = require('data.task');
var request = require('../utils/request');
var getSession = require('./session-store');

var _require2 = require('./url-builder'),
    buildWatchFragmentsUrl = _require2.buildWatchFragmentsUrl,
    buildCommentServiceUrl = _require2.buildCommentServiceUrl;

// TODO: make # retries configurable


var withRetries = delayedRetry(3, function (n) {
  return n * n * 500;
});

var requestWithRetries = function requestWithRetries(arg) {
  return withRetries(function () {
    return request(arg);
  });
};

var buildRequestForm = function buildRequestForm(session, pageToken) {
  return {
    session_token: session.sessionToken,
    page_token: pageToken
  };
};

var buildJsonPostRequest = function buildJsonPostRequest(url, form, session) {
  return {
    method: 'POST',
    headers: {
      'accept-language': 'en-US;q=1.0,en;q=0.9'
    },
    json: true,
    jar: session.cookieJar,
    url: url,
    form: form
  };
};

var getBody = function getBody(res) {
  return Either.fromNullable(res.body).leftMap(function (_) {
    return 'Invalid response from YouTube. Missing body,';
  }).fold(Task.rejected, Task.of);
};

var commentPage = function commentPage(videoId, pageToken) {
  return getSession(videoId).map(function (sess) {
    return buildJsonPostRequest(buildCommentServiceUrl('action_get_comments'), buildRequestForm(sess, pageToken), sess);
  }).chain(requestWithRetries).chain(getBody);
};

var commentReplies = function commentReplies(videoId, repliesToken) {
  return getSession(videoId).map(function (sess) {
    return buildJsonPostRequest(buildCommentServiceUrl('action_get_comment_replies'), buildRequestForm(sess, repliesToken), sess);
  }).chain(requestWithRetries).chain(getBody);
};

var commentsWatchFragment = function commentsWatchFragment(videoId) {
  return getSession(videoId).map(function (sess) {
    return buildJsonPostRequest(buildWatchFragmentsUrl(videoId, sess, ['comments']), buildRequestForm(sess), sess);
  }).chain(requestWithRetries).chain(getBody);
};

module.exports = { commentPage: commentPage, commentReplies: commentReplies, commentsWatchFragment: commentsWatchFragment };