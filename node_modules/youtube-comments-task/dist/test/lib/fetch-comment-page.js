'use strict';

var _require = require('chai'),
    expect = _require.expect;

var td = require('testdouble');
var Task = require('data.task');

var contentHtml = function contentHtml(n) {
  return '<div>comment_page_' + n + '</div>';
};
var loadMoreWidgetHtml = function loadMoreWidgetHtml(t) {
  return '\n  <div>\n    <button attr1=15 data-uix-load-more-post-body="page_token=' + encodeURIComponent(t) + '" attr3="bla">Show more</button>\n  </div>';
};

describe('/lib/fetch-comments.js', function () {
  afterEach(function () {
    td.reset();
  });

  it('exports a function', function () {
    var fetchCommentPage = require('../../lib/fetch-comment-page');
    expect(fetchCommentPage).to.be.a('function');
  });

  it('fetches a single comment page HTML', function (done) {
    var videoId = 'videoId';
    var pageToken = 'token1';

    var Youtube = td.replace('../../lib/youtube-api/youtube-api');
    var fetchCommentPage = require('../../lib/fetch-comment-page');
    var html = contentHtml(1);

    td.when(Youtube.commentPage(videoId, pageToken)).thenReturn(Task.of({
      content_html: html
    }));

    fetchCommentPage(videoId, pageToken).fork(function (e) {
      return done('Got an error: ' + e);
    }, function (p) {
      expect(p).to.have.property('commentHtml').equal(html);
      expect(p).not.to.have.property('nextPageToken');
      done();
    });
  });

  it('includes the next page token in the result', function (done) {
    var videoId = 'videoId';
    var pageToken = 'token1';

    var Youtube = td.replace('../../lib/youtube-api/youtube-api');
    var fetchCommentPage = require('../../lib/fetch-comment-page');
    var commentHtml = contentHtml(1);
    var nextPageToken = 'EhYSC3B2QXNxUGJ6OVJvwAEAyAEA4AEBGAYyWwpGQ2cwUWhaSEkwdURZMFFJZ0FDZ0JFaFFJQmhEUTZOQzdsOWpSQWhpNDE4Ym9nTV9SQWhnQ0lBNG9oSl92ZzVUTTJkVzRBUSIPIgtwdkFzcVBiejlSbzABKA4%3D';
    var loadMoreHtml = loadMoreWidgetHtml(nextPageToken);

    td.when(Youtube.commentPage(videoId, pageToken)).thenReturn(Task.of({
      content_html: commentHtml,
      load_more_widget_html: loadMoreHtml
    }));

    fetchCommentPage(videoId, pageToken).fork(function (e) {
      return done('Got an error: ' + e);
    }, function (p) {
      expect(p).to.have.property('commentHtml').equal(commentHtml);
      expect(p).to.have.property('nextPageToken').equal(nextPageToken);
      done();
    });
  });

  it('task fails with an error if fetch fails', function (done) {
    var videoId = 'videoId';
    var pageToken = 'token1';
    var message = 'fetch failed error msg';
    var expectedError = { message: message };

    var Youtube = td.replace('../../lib/youtube-api/youtube-api');
    var errorHandler = td.replace('../../lib/error-handler');
    var fetchCommentPage = require('../../lib/fetch-comment-page');

    td.when(Youtube.commentPage(videoId, pageToken)).thenReturn(Task.rejected(message));

    td.when(errorHandler.scraperError({
      videoId: videoId,
      message: message,
      component: 'fetch-comment-page',
      operation: 'fetch-comment-page'
    })).thenReturn(expectedError);

    fetchCommentPage(videoId, pageToken).fork(function (e) {
      expect(e).to.deep.equal(expectedError);
      done();
    }, function (_) {
      return done('task should not succeed');
    });
  });

  it('fails with an error if response is invalid', function (done) {
    var videoId = 'videoId';
    var pageToken = 'token1';
    var expectedError = { error: 'here' };

    var Youtube = td.replace('../../lib/youtube-api/youtube-api');
    var errorHandler = td.replace('../../lib/error-handler');
    var fetchCommentPage = require('../../lib/fetch-comment-page');

    td.when(Youtube.commentPage(videoId, pageToken)).thenReturn(Task.of({ nonsense: 'yep' }));

    td.when(errorHandler.scraperError({
      videoId: videoId,
      message: 'API response does not contain a "content_html" field',
      component: 'fetch-comment-page',
      operation: 'fetch-comment-page'
    })).thenReturn(expectedError);

    fetchCommentPage(videoId, pageToken).fork(function (e) {
      expect(e).to.deep.equal(expectedError);
      done();
    }, function (_) {
      return done('task should not succeed');
    });
  });

  it('fails with an error if the load_more_widget_html does not contain a next page token', function (done) {
    var videoId = 'videoId';
    var pageToken = 'token1';
    var expectedError = { error: 'here' };

    var Youtube = td.replace('../../lib/youtube-api/youtube-api');
    var errorHandler = td.replace('../../lib/error-handler');
    var fetchCommentPage = require('../../lib/fetch-comment-page');

    td.when(Youtube.commentPage(videoId, pageToken)).thenReturn(Task.of({
      content_html: contentHtml(1),
      load_more_widget_html: '<div>bla</div>'
    }));

    td.when(errorHandler.scraperError({
      videoId: videoId,
      message: 'API resonse load_more_widget_html does not contain a next page token',
      component: 'fetch-comment-page',
      operation: 'fetch-comment-page'
    })).thenReturn(expectedError);

    fetchCommentPage(videoId, pageToken).fork(function (e) {
      expect(e).to.deep.equal(expectedError);
      done();
    }, function (_) {
      return done('task should not succeed');
    });
  });
});