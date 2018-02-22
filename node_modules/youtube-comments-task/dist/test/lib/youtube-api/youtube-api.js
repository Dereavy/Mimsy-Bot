'use strict';

var _require = require('chai'),
    expect = _require.expect;

var td = require('testdouble');
var Task = require('data.task');

var _require2 = require('../../../lib/youtube-api/url-builder'),
    buildWatchFragmentsUrl = _require2.buildWatchFragmentsUrl,
    buildCommentServiceUrl = _require2.buildCommentServiceUrl;

describe('/lib/youtube-api/youtube-api', function () {
  afterEach(function () {
    td.reset();
  });

  it('module exports an object', function () {
    var Youtube = require('../../../lib/youtube-api/youtube-api');
    expect(Youtube).to.be.a('object');
  });

  it('commentPage is a function on the object', function () {
    var Youtube = require('../../../lib/youtube-api/youtube-api');
    expect(Youtube).to.have.property('commentPage').that.is.a('function');
  });

  it('commentPage fetches comment page', function (done) {
    var videoId = 'videoId';
    var pageToken = 'pageToken';
    var url = buildCommentServiceUrl('action_get_comments');
    var html = '<p>comment page</p>';
    var apiResponse = { content_html: html };
    var cookieJar = { cookies: 'yep' };
    var session = { sessionToken: 'sess', commentsToken: 'comm', cookieJar: cookieJar };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: pageToken,
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentPage(videoId, pageToken).fork(function (e) {
      return done('got error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('commentPage will re-fetch if first attempt fails', function (done) {
    var videoId = 'videoId';
    var pageToken = 'pageToken';
    var url = buildCommentServiceUrl('action_get_comments');
    var html = '<p>comment page</p>';
    var apiResponse = { content_html: html };
    var cookieJar = { cookies: 'yep' };
    var session = { sessionToken: 'sess', commentsToken: 'comm', cookieJar: cookieJar };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: pageToken,
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.rejected('na-ah'), Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentPage(videoId, pageToken).fork(function (e) {
      return done('got error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('commentReplies is a function on the object', function () {
    var Youtube = require('../../../lib/youtube-api/youtube-api');
    expect(Youtube).to.have.property('commentReplies').that.is.a('function');
  });

  it('commentReplies fetches comment replies', function (done) {
    var videoId = 'videoId';
    var repliesToken = 'repliesToken';
    var url = buildCommentServiceUrl('action_get_comment_replies');
    var html = '<p>replies content</p>';
    var apiResponse = { content_html: html };
    var cookieJar = { cookies: 'yep' };
    var session = { sessionToken: 'sess', commentsToken: 'comm', cookieJar: cookieJar };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: repliesToken,
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentReplies(videoId, repliesToken).fork(function (e) {
      return done('got an error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('commentReplies will re-fetch if first attempt fails', function (done) {
    var videoId = 'videoId';
    var repliesToken = 'repliesToken';
    var url = buildCommentServiceUrl('action_get_comment_replies');
    var html = '<p>comment page</p>';
    var apiResponse = { content_html: html };
    var cookieJar = { cookies: 'yep' };
    var session = { sessionToken: 'sess', commentsToken: 'comm', cookieJar: cookieJar };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: repliesToken,
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.rejected('na-ah'), Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentReplies(videoId, repliesToken).fork(function (e) {
      return done('got an error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('commentsWatchFragment is a function on the object', function () {
    var Youtube = require('../../../lib/youtube-api/youtube-api');
    expect(Youtube).to.have.property('commentsWatchFragment').that.is.a('function');
  });

  it('commentsWatchFragment fetches comments watch fragment', function (done) {
    var videoId = 'videoId';
    var session = { sessionToken: 'sess', commentsToken: 'comm' };
    var url = buildWatchFragmentsUrl(videoId, session, ['comments']);
    var html = '<p>comments watch fragment</p>';
    var apiResponse = { body: { watch_discussion: html } };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.rejected('na-ah'), Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentsWatchFragment(videoId, session, request).fork(function (e) {
      return done('got an error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('commentsWatchFragment re-fetches if fetch fails', function (done) {
    var videoId = 'videoId';
    var session = { sessionToken: 'sess', commentsToken: 'comm' };
    var url = buildWatchFragmentsUrl(videoId, session, ['comments']);
    var html = '<p>comments watch fragment</p>';
    var apiResponse = { body: { watch_discussion: html } };

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.rejected('na-ah'), Task.of({ body: apiResponse }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentsWatchFragment(videoId, session, request).fork(function (e) {
      return done('got an error ' + e);
    }, function (res) {
      expect(res).to.deep.equal(apiResponse);
      done();
    });
  });

  it('results in an error if the reponse does not have a body', function (done) {
    var videoId = 'videoId';
    var session = { sessionToken: 'sess', commentsToken: 'comm' };
    var url = buildWatchFragmentsUrl(videoId, session, ['comments']);

    var getSession = td.replace('../../../lib/youtube-api/session-store');
    var request = td.replace('../../../lib/utils/request');
    var Youtube = require('../../../lib/youtube-api/youtube-api');

    var requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        session_token: session.sessionToken
      }
    });

    td.when(request(requestMatcher)).thenReturn(Task.rejected('na-ah'), Task.of({ some: 'garbage' }));

    td.when(getSession(videoId)).thenReturn(Task.of(session));

    Youtube.commentsWatchFragment(videoId, session, request).fork(function (e) {
      expect(e).to.match(/body/i);
      done();
    }, function (res) {
      done('should not succeed ' + res);
    });
  });
});