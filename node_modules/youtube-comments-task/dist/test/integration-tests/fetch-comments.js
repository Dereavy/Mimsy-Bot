'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');
var Task = require('data.task');

var fetchComments = require('../../lib/fetch-comments');
var traverse = require('../../lib/utils/traverse-array');

var validateComment = function validateComment(c) {
  expect(c).to.have.property('id').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('author').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('authorLink').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('authorThumb').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('text').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('likes').that.is.a('number').of.at.least(0);
  expect(c).to.have.property('time').that.is.a('string').of.length.at.least(1);
  expect(c).to.have.property('timestamp').that.is.a('number').above(0), expect(c).to.have.property('edited').that.is.a('boolean');
};

describe('/lib/fetch-comments', function () {
  this.timeout(30000);

  it('fetches first page of comments (no pageToken)', function (done) {
    var videoId = '9bZkp7q19f0';
    fetchComments(videoId).fork(function (e) {
      return done('Got an error: ' + e);
    }, function (p) {
      expect(p).to.have.property('comments').that.is.an('array').of.length.above(1);
      expect(p).to.have.property('nextPageToken').that.is.a('string').of.length.above(1);

      p.comments.forEach(function (c) {
        validateComment(c);
        expect(c).to.have.property('hasReplies').that.is.a('boolean');
        if (c.hasReplies) {
          expect(c).to.have.property('replies').that.is.an('array').of.length(c.numReplies);
          expect(c).to.have.property('numReplies').that.is.a('number').that.is.equal(c.replies.length);
          c.replies.forEach(validateComment);
        }
      });
      done();
    });
  });

  it('fetches next page of comments (with pageToken)', function (done) {
    var videoId = '9bZkp7q19f0';
    fetchComments(videoId).chain(function (_ref) {
      var nextPageToken = _ref.nextPageToken;
      return fetchComments(videoId, nextPageToken);
    }).fork(function (e) {
      return done('Got an error: ' + e);
    }, function (p) {
      expect(p).to.have.property('comments').that.is.an('array').of.length.above(1);
      expect(p).to.have.property('nextPageToken').that.is.a('string').of.length.above(1);

      p.comments.forEach(function (c) {
        validateComment(c);
        expect(c).to.have.property('hasReplies').that.is.a('boolean');
        if (c.hasReplies) {
          expect(c).to.have.property('replies').that.is.an('array').of.length(c.numReplies);
          expect(c).to.have.property('numReplies').that.is.a('number').that.is.equal(c.replies.length);
          c.replies.forEach(validateComment);
        }
      });
      done();
    });
  });

  it('fetches multiple comment pages in parallel', function (done) {
    var video1Id = '9bZkp7q19f0';
    var video2Id = 'Ukg_U3CnJWI';

    traverse([video1Id, video1Id, video2Id, video2Id], Task.of, fetchComments).fork(function (e) {
      return done('Got an error: ' + e);
    }, function (ps) {
      expect(ps).to.be.an('array').of.length(4);
      ps.forEach(function (p) {
        expect(p).to.have.property('comments').that.is.an('array').of.length.above(1);
        expect(p).to.have.property('nextPageToken').that.is.a('string').of.length.above(1);

        p.comments.forEach(function (c) {
          validateComment(c);
          expect(c).to.have.property('hasReplies').that.is.a('boolean');
          if (c.hasReplies) {
            expect(c).to.have.property('replies').that.is.an('array').of.length(c.numReplies);
            expect(c).to.have.property('numReplies').that.is.a('number').that.is.equal(c.replies.length);
            c.replies.forEach(validateComment);
          }
        });
      });
      done();
    });
  });
});