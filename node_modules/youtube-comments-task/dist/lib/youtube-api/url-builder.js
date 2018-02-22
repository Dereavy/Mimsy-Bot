'use strict';

var qs = require('querystring');

var VIDEO_PAGE_URL = 'https://www.youtube.com/watch';
var WATCH_FRAGMENTS_URL = 'https://www.youtube.com/watch_fragments_ajax';
var COMMENT_SERVICE_URL = 'https://www.youtube.com/comment_service_ajax';

var buildVideoPageUrl = function buildVideoPageUrl(videoId) {
  var query = qs.stringify({
    v: videoId
  });

  return VIDEO_PAGE_URL + '?' + query;
};

var buildWatchFragmentsUrl = function buildWatchFragmentsUrl(videoId, session) {
  var fragments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['comments'];

  var query = qs.stringify({
    v: videoId,
    ctoken: session.commentsToken,
    frags: fragments.join(','),
    tr: 'time',
    distiller: 1,
    spf: 'load'
  });

  return WATCH_FRAGMENTS_URL + '?' + query;
};

var buildCommentServiceUrl = function buildCommentServiceUrl(action) {
  return COMMENT_SERVICE_URL + '?' + action + '=1';
};

module.exports = {
  VIDEO_PAGE_URL: VIDEO_PAGE_URL,
  WATCH_FRAGMENTS_URL: WATCH_FRAGMENTS_URL,
  COMMENT_SERVICE_URL: COMMENT_SERVICE_URL,
  buildVideoPageUrl: buildVideoPageUrl,
  buildWatchFragmentsUrl: buildWatchFragmentsUrl,
  buildCommentServiceUrl: buildCommentServiceUrl
};