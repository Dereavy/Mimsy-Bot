'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');

var fetchFirstPageToken = require('../../lib/fetch-first-page-token');
var youtubeApi = require('../../lib/youtube-api/youtube-api');

describe('/lib/youtube-api', function () {
  this.timeout(10000);

  it('fetches a comment page', function (done) {
    var videoId = 'h_tkIpwbsxY';
    fetchFirstPageToken(videoId).chain(function (token) {
      return youtubeApi.commentPage(videoId, token);
    }).fork(function (e) {
      return done('got an error ' + e.substr(0, 100));
    }, function (p) {
      expect(p).to.have.property('content_html').that.is.a('string');
      var $ = cheerio.load(p.content_html);
      expect($('.comment-thread-renderer').length).to.be.above(1);
      expect($('.comment-renderer').length).to.be.above(1);
      done();
    });
  });

  it('fetches comment replies', function (done) {
    var videoId = 's6MwGeOm8iI';
    var repliesToken = 'EhYSC3M2TXdHZU9tOGlJwAEAyAEA4AEBGAYyWRpXEiN6MTIxenBwaGVzbTF1cGg0eTA0Y2YxZzV0bHllamRzajAzayICCAAqGFVDM1hUelZ6YUhRRWQzMHJRYnV2Q3RUUTILczZNd0dlT204aUk4AEABSPQD';
    youtubeApi.commentReplies(videoId, repliesToken).fork(function (e) {
      return done('got an error ' + e.substr(0, 100));
    }, function (r) {
      expect(r).to.have.property('content_html').that.is.a('string');
      var $ = cheerio.load(r.content_html);
      expect($('.comment-renderer').length).to.be.above(1);
      done();
    });
  });

  it('fetches comments watch fragment', function (done) {
    var videoId = 'h_tkIpwbsxY';
    youtubeApi.commentsWatchFragment(videoId).fork(function (e) {
      return done('got an error ' + e.substr(0, 100));
    }, function (r) {
      expect(r).to.have.property('name').that.is.a('string');
      expect(r).to.have.property('body').that.is.an('object');
      expect(r.body).to.have.property('watch-discussion').that.is.a('string');
      expect(r).to.have.property('foot').that.is.a('string');

      var $ = cheerio.load(r.body['watch-discussion']);
      expect($('.comment-thread-renderer').length).to.be.above(1);
      expect($('.comment-renderer').length).to.be.above(1);
      done();
    });
  });
});