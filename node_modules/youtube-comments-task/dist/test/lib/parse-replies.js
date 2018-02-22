'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');
var moment = require('moment');
var td = require('testdouble');
var Either = require('data.either');

var _require2 = require('../sample-comment-html'),
    sampleComment = _require2.sampleComment;

var validateComment = function validateComment(comment, exp) {
  expect(comment).to.be.ok;

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

describe('/lib/parse-replies.js', function () {
  afterEach(function () {
    td.reset();
  });

  it('parses replies', function (done) {
    var parseReplies = require('../../lib/parse-replies');

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

    var html = sampleComment({}, replies);
    var $replies = cheerio(html).find('.comment-replies-renderer');

    parseReplies($replies).fold(function (e) {
      expect.fail(e);
      done(e);
    }, function (result) {
      expect(replies).to.be.a('array').of.length(2);
      result.forEach(function (r, i) {
        return validateComment(r, replies[i]);
      });
      done();
    });
  });

  it('fails if parsing of one reply fails', function () {
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

    var html = sampleComment({}, replies);
    var $replies = cheerio(html).find('.comment-replies-renderer');

    var parseCommentRenderer = td.replace('../../lib/parse-comment-renderer');
    var parseReplies = require('../../lib/parse-replies');

    var result1 = 'result1';
    var error = 'error';

    td.when(parseCommentRenderer(), { ignoreExtraArgs: true }).thenReturn(Either.of(result1), Either.Left(error));

    parseReplies($replies).fold(function (e) {
      expect(e).to.equal(error);
    }, function (result) {
      expect.fail('expected to fail ' + result);
    });
  });
});