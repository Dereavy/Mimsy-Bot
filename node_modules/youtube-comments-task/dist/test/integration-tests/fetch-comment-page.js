'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');

var fetchCommentPage = require('../../lib/fetch-comment-page');
var fetchFirstPageToken = require('../../lib/fetch-first-page-token');

describe('/lib/fetch-comment-page', function () {
  this.timeout(10000);
  it('fetches a comment page', function (done) {
    var videoId = '9bZkp7q19f0';
    fetchFirstPageToken(videoId).chain(function (t) {
      return fetchCommentPage(videoId, t);
    }).fork(function (e) {
      return done('got an error' + e);
    }, function (p) {
      expect(p).to.have.property('commentHtml').that.is.a('string').of.length.above(1);
      expect(p).to.have.property('nextPageToken').that.is.a('string').of.length.above(1);

      var $ = cheerio.load(p.commentHtml);
      expect($('.comment-thread-renderer').length).to.be.above(1);
      expect($('.comment-renderer').length).to.be.above(1);
      done();
    });
  });
});