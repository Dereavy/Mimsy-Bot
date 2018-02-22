'use strict';

var _require = require('chai'),
    expect = _require.expect;

var nodeUrl = require('url');

var _require2 = require('../../../lib/youtube-api/url-builder'),
    VIDEO_PAGE_URL = _require2.VIDEO_PAGE_URL,
    WATCH_FRAGMENTS_URL = _require2.WATCH_FRAGMENTS_URL,
    COMMENT_SERVICE_URL = _require2.COMMENT_SERVICE_URL,
    buildVideoPageUrl = _require2.buildVideoPageUrl,
    buildWatchFragmentsUrl = _require2.buildWatchFragmentsUrl,
    buildCommentServiceUrl = _require2.buildCommentServiceUrl;

describe('/lib/youtube-api/url-build.js', function () {
  it('exports buildVideoPageUrl() function', function () {
    expect(buildVideoPageUrl).to.be.a('function');
  });

  it('exports buildWatchFragmentsUrl() function', function () {
    expect(buildWatchFragmentsUrl).to.be.a('function');
  });

  it('exports a buildCommentServiceUrl() function', function () {
    expect(buildCommentServiceUrl).to.be.a('function');
  });

  it('buildVideoPageUrl() builds a video page url', function () {
    var videoId = 'K23jKl24k';
    var urlStr = buildVideoPageUrl(videoId);

    expect(urlStr.indexOf(VIDEO_PAGE_URL + '?')).to.equal(0);

    var url = nodeUrl.parse(urlStr, true);
    expect(url.query).to.deep.equal({ v: videoId });
  });

  it('buildWatchFragmentsUrl() builds a watch fragments url', function () {
    var videoId = 'K23jKl24k';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var session = { commentsToken: commentsToken };
    var fragments = ['comments', 'andmore'];

    var urlStr = buildWatchFragmentsUrl(videoId, session, fragments);
    expect(urlStr.indexOf(WATCH_FRAGMENTS_URL + '?')).to.equal(0);

    var url = nodeUrl.parse(urlStr, true);
    expect(url.query).to.deep.equal({
      v: videoId,
      ctoken: commentsToken,
      frags: fragments.join(','),
      tr: 'time',
      distiller: '1',
      spf: 'load'
    });
  });

  it('buildWatchFragmentsUrl() uses default fragment if not given', function () {
    var videoId = 'K23jKl24k';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var session = { commentsToken: commentsToken };
    var defaultFragment = 'comments';

    var urlStr = buildWatchFragmentsUrl(videoId, session);
    expect(urlStr.indexOf(WATCH_FRAGMENTS_URL + '?')).to.equal(0);

    var url = nodeUrl.parse(urlStr, true);
    expect(url.query).to.deep.equal({
      v: videoId,
      ctoken: commentsToken,
      frags: defaultFragment,
      tr: 'time',
      distiller: '1',
      spf: 'load'
    });
  });

  it('buildCommentServiceUrl() builds a comment service url', function () {
    var action = 'action_get_comments';
    var exp = COMMENT_SERVICE_URL + '?' + action + '=1';
    expect(buildCommentServiceUrl(action)).to.equal(exp);
  });
});