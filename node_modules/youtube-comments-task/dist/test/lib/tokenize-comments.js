'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerio = require('cheerio');
var Either = require('data.either');

var tokenizeComments = require('../../lib/tokenize-comments');

describe('/lib/tokenize-comments.js', function () {
  it('exports a function', function () {
    expect(tokenizeComments).to.be.a('function');
  });

  it("returns an empty array if the html doesn't contain any comments", function () {
    var html = '<div><div class="no-comment">nope</div><div class="no-comment">hahaha</div></div>';
    var result = tokenizeComments(html);
    expect(result).to.be.instanceof(Either);

    result.fold(function (e) {
      return expect.fail('Should not have an error ' + e);
    }, function (commentTokens) {
      expect(commentTokens).to.be.a('array').of.length(0);
    });
  });

  it('returns an array of cheerio tokens', function () {
    var c1 = 'comment1';
    var r1 = 'reply1';
    var c2 = 'comment2';
    var html = ['<section class="comment-thread-renderer">', ' <div class="comment-renderer">' + c1 + '</div>', ' <div class="comment-replies-renderer">', '   <div class="comment-replies-renderer-header">', '     <div class="yt-uix-expander-collapsed-body">', '       <button class="comment-replies-renderer-paginator">', '       <div class="comment-renderer">' + r1 + '</div>', '     </div>', '   </div>', ' </div>', '</section>', '<section class="comment-thread-renderer">', ' <div class="comment-renderer">' + c2 + '</div>', ' <div class="comment-replies-renderer"></div>', '</section>'].join('');

    var result = tokenizeComments(html);

    result.fold(function (e) {
      return expect.fail('Should not have an error ' + e);
    }, function (commentTokens) {
      expect(commentTokens).to.be.a('array').of.length(2);

      var $comment1 = cheerio(commentTokens[0]);
      var $comment2 = cheerio(commentTokens[1]);
      expect($comment1.find('.comment-thread-renderer > .comment-renderer').text()).to.equal(c1);
      expect($comment1.find('.comment-replies-renderer .comment-renderer').text()).to.equal(r1);
      expect($comment2.find('.comment-thread-renderer > .comment-renderer').text()).to.equal(c2);
    });
  });
});