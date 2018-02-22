'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');
var moment = require('moment');

var parseCommentThread = require('../../lib/parse-comment-thread');

var _require2 = require('../sample-comment-html'),
    sampleComment = _require2.sampleComment,
    COMMENT_ID = _require2.COMMENT_ID,
    COMMENT_AUTHOR = _require2.COMMENT_AUTHOR,
    COMMENT_AUTHOR_LINK = _require2.COMMENT_AUTHOR_LINK,
    COMMENT_AUTHOR_THUMB = _require2.COMMENT_AUTHOR_THUMB,
    COMMENT_TIME = _require2.COMMENT_TIME,
    COMMENT_TEXT = _require2.COMMENT_TEXT,
    COMMENT_LIKES = _require2.COMMENT_LIKES,
    REPLIES_TOKEN = _require2.REPLIES_TOKEN;

var validateComment = function validateComment(comment, exp) {
  expect(comment).to.have.property('id', exp.id);
  expect(comment).to.have.property('author', exp.author);
  expect(comment).to.have.property('authorLink', exp.authorLink);
  expect(comment).to.have.property('authorThumb', exp.authorThumb);
  expect(comment).to.have.property('text', exp.text);
  expect(comment).to.have.property('likes', exp.likes);
  expect(comment).to.have.property('time', exp.time);
  expect(comment).to.have.property('timestamp').that.is.a('number').closeTo(exp.timestamp, 60 * 1000);
  expect(comment).to.have.property('edited', exp.edited);
};

describe('/lib/parse-comment-thread.js', function () {
  it('exports a function', function () {
    expect(parseCommentThread).to.be.a('function');
  });

  it('parses a comment thread without replies', function (done) {
    var exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10),
      edited: false,
      hasReplies: false
    };

    var html = sampleComment(exp);
    parseCommentThread(cheerio(html)).fold(function (e) {
      expect.fail(e);
      done(e);
    }, function (result) {
      validateComment(result, exp);
      expect(result).to.have.property('hasReplies', false);
      done();
    });
  });

  it('parses comment with replies (non-collapsed)', function (done) {
    var comment = {
      id: 'commentid',
      author: 'comment_author',
      authorLink: 'comment_author_link',
      authorThumb: 'comment_author_thumb',
      text: 'comment_text',
      likes: 3,
      time: '1 week ago',
      timestamp: parseInt(moment().subtract(1, 'week').format('x'), 10),
      edited: false,
      hasReplies: true,
      numReplies: 2
    };

    var replies = [{
      id: 'commentid.reply1id',
      author: 'reply1_author',
      authorLink: 'reply1_author_link',
      authorThumb: 'reply1_author_thumb',
      text: 'reply1_text',
      likes: 10,
      time: '10 hours ago',
      timestamp: parseInt(moment().subtract(10, 'hours').format('x'), 10),
      edited: true
    }, {
      id: 'commentid.reply2id',
      author: 'reply2_author',
      authorLink: 'reply2_author_link',
      authorThumb: 'reply2_author_thumb',
      text: 'reply2_text',
      likes: 0,
      time: '2 minutes ago',
      timestamp: parseInt(moment().subtract(2, 'minutes').format('x'), 10),
      edited: false
    }];

    var html = sampleComment(comment, replies);

    parseCommentThread(cheerio(html)).fold(function (e) {
      expect.fail(e);
    }, function (result) {
      validateComment(result, comment);
      expect(result).to.have.property('hasReplies', true);
      expect(result).to.have.property('numReplies', 2);
      expect(result).to.have.property('replies').which.is.a('array').of.length(2);
      result.replies.forEach(function (r, i) {
        return validateComment(r, replies[i]);
      });
      done();
    });
  });

  it('parses comment replies information (collapsed comments)', function (done) {
    var comment = {
      id: 'commentid',
      author: 'comment_author',
      authorLink: 'comment_author_link',
      authorThumb: 'comment_author_thumb',
      text: 'comment_text',
      likes: 3,
      time: '1 week ago',
      timestamp: parseInt(moment().subtract(1, 'week').format('x'), 10),
      hasReplies: true,
      repliesToken: REPLIES_TOKEN,
      edited: true
    };

    var replies = [{
      id: 'commentid.reply1id',
      author: 'reply1_author',
      authorLink: 'reply1_author_link',
      authorThumb: 'reply1_author_thumb',
      text: 'reply1_text',
      likes: 10,
      time: '10 hours ago',
      timestamp: parseInt(moment().subtract(10, 'hours').format('x'), 10),
      edited: true
    }, {
      id: 'commentid.reply2id',
      author: 'reply2_author',
      authorLink: 'reply2_author_link',
      authorThumb: 'reply2_author_thumb',
      text: 'reply2_text',
      likes: 0,
      time: '2 minutes ago',
      timestamp: parseInt(moment().subtract(2, 'minutes').format('x'), 10),
      edited: true
    }, {
      id: 'commentid.reply3id',
      author: 'reply3_author',
      authorLink: 'reply3_author_link',
      authorThumb: 'reply3_author_thumb',
      text: 'reply3_text',
      likes: 0,
      time: '1 minute ago',
      timestamp: parseInt(moment().subtract(1, 'minute').format('x'), 10),
      edited: true
    }];

    var html = sampleComment(comment, replies);

    parseCommentThread(cheerio(html)).fold(function (e) {
      expect.fail(e);
      done(e);
    }, function (result) {
      validateComment(result, comment);
      expect(result).to.have.property('hasReplies', true);
      expect(result).to.not.have.property('replies');
      done();
    });
  });

  it('fails if $commentThread parameter is missing', function () {
    parseCommentThread().fold(function (e) {
      expect(e).to.equal('$commentThread parameter must be defined');
    }, function (result) {
      return done('should fail ' + result);
    });
  });
});