'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('ramda'),
    omit = _require.omit;

var Either = require('data.either');

var _require2 = require('control.monads'),
    liftM2 = _require2.liftM2;

var prop = require('propper');

var _require3 = require('./utils/string-utils'),
    regExec = _require3.regExec,
    strTrim = _require3.strTrim;

var eitherToTask = require('./utils/either-to-task');

var _require4 = require('./youtube-api/youtube-api'),
    commentPage = _require4.commentPage;

var _require5 = require('./error-handler'),
    scraperError = _require5.scraperError;

var getContentHtml = function getContentHtml(response) {
  return Either.fromNullable(prop(response, 'content_html')).leftMap(function (_) {
    return 'API response does not contain a "content_html" field';
  });
};

var extractNextPageToken = function extractNextPageToken(loadMoreWidgetHtml) {
  return regExec(/data-uix-load-more-post-body\s*=\s*"page_token=([^"]+)"/i, loadMoreWidgetHtml).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        _ = _ref2[0],
        t = _ref2[1];

    return t;
  }).map(strTrim).map(decodeURIComponent).leftMap(function (_) {
    return 'API resonse load_more_widget_html does not contain a next page token';
  });
};

var fetchCommentPage = function fetchCommentPage(videoId, pageToken) {
  return commentPage(videoId, pageToken).map(function (p) {
    return liftM2(function (commentHtml, nextPageToken) {
      return { commentHtml: commentHtml, nextPageToken: nextPageToken };
    }, getContentHtml(p), p.load_more_widget_html ? extractNextPageToken(p.load_more_widget_html) : Either.of(null));
  }).chain(eitherToTask).map(function (r) {
    return r.nextPageToken ? r : omit('nextPageToken', r);
  }).rejectedMap(function (e) {
    return e.type ? e : scraperError({
      videoId: videoId,
      message: e,
      component: 'fetch-comment-page',
      operation: 'fetch-comment-page'
    });
  });
};

module.exports = fetchCommentPage;