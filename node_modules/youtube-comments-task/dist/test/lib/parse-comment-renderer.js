'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');
var moment = require('moment');

var parseCommentRenderer = require('../../lib/parse-comment-renderer');

var _require2 = require('../sample-comment-html'),
    sampleComment = _require2.sampleComment,
    COMMENT_ID = _require2.COMMENT_ID,
    COMMENT_AUTHOR = _require2.COMMENT_AUTHOR,
    COMMENT_AUTHOR_LINK = _require2.COMMENT_AUTHOR_LINK,
    COMMENT_AUTHOR_THUMB = _require2.COMMENT_AUTHOR_THUMB,
    COMMENT_TIME = _require2.COMMENT_TIME,
    COMMENT_TEXT = _require2.COMMENT_TEXT,
    COMMENT_LIKES = _require2.COMMENT_LIKES,
    COMMENT_EDITED = _require2.COMMENT_EDITED,
    REPLIES_TOKEN = _require2.REPLIES_TOKEN;

describe('/lib/parse-comment-renderer.js', function () {
  it('exports a function', function () {
    expect(parseCommentRenderer).to.be.a('function');
  });

  it('parses simple comment fields', function (done) {
    var exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10),
      edited: COMMENT_EDITED
    };

    var html = sampleComment(exp);
    var $commentRenderer = cheerio.load(html)('.comment-thread-renderer > .comment-renderer:nth-child(1)');

    parseCommentRenderer($commentRenderer).fold(function (e) {
      expect.fail(e);
      done(e);
    }, function (result) {
      expect(result).to.have.property('id', exp.id);
      expect(result).to.have.property('author', exp.author);
      expect(result).to.have.property('authorLink', exp.authorLink);
      expect(result).to.have.property('authorThumb', exp.authorThumb);
      expect(result).to.have.property('text', exp.text);
      expect(result).to.have.property('likes', exp.likes);
      expect(result).to.have.property('time', exp.time);
      expect(result).to.have.property('timestamp').that.is.a('number').closeTo(exp.timestamp, 60 * 1000);
      done();
    });
  });

  it('handles missing fields on comment', function (done) {
    var exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10),
      edited: COMMENT_EDITED
    };
    var html = sampleComment(exp);
    var $commentRenderer = cheerio.load(html)('.comment-thread-renderer > .comment-renderer:nth-child(1)');
    $commentRenderer.removeAttr('data-cid');
    $commentRenderer.find('.comment-author-text').text('');
    $commentRenderer.find('a.comment-author-text').removeAttr('href');
    $commentRenderer.find('.comment-author-thumbnail img').remove();
    $commentRenderer.find('.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').remove();
    $commentRenderer.find('.comment-action-buttons-toolbar > .comment-renderer-like-count.on').remove();
    $commentRenderer.find('.comment-renderer-header > .comment-renderer-time').remove();

    parseCommentRenderer($commentRenderer).fold(function (e) {
      done(e);
    }, function (result) {
      expect(result).to.deep.equal({});
      done();
    });
  });

  it('fails if $commentRenderer parameter is missing', function () {
    parseCommentRenderer().fold(function (e) {
      expect(e).to.equal('$commentRenderer parameter must be defined');
    }, function (result) {
      return done('should fail ' + result);
    });
  });
});