'use strict';

var _require = require('chai'),
    expect = _require.expect;

var td = require('testdouble');
var Task = require('data.task');

var _require2 = require('../../../lib/youtube-api/url-builder'),
    buildVideoPageUrl = _require2.buildVideoPageUrl;

describe('/lib/youtube-api/session-store', function () {
  afterEach(function () {
    td.reset();
  });

  it('module exports a function', function () {
    var getSession = require('../../../lib/youtube-api/session-store');
    expect(getSession).to.be.a('function');
  });

  it('session store fetches tokens and cookies', function (done) {
    var videoId = 'first_video_id';
    var sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var url = buildVideoPageUrl(videoId);
    var body = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken) + '",}\n    </script></html>';
    var cookieJar = { cookies: 'yep' };

    var request = td.replace('../../../lib/utils/request');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(request(url)).thenReturn(Task.of({ body: body, cookieJar: cookieJar }));

    getSession(videoId).fork(function (e) {
      return done('got an error ' + e);
    }, function (s) {
      expect(s).to.deep.equal({ sessionToken: sessionToken, commentsToken: commentsToken, cookieJar: cookieJar });
      done();
    });
  });

  it('task fails if session token cannot be found', function (done) {
    var videoId = 'the_video_id';
    var sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var expectedError = { error: 'here' };
    var url = buildVideoPageUrl(videoId);
    var body = '<html><script>\n      var stuff = {\'NOTHING_TOKEN\': "' + sessionToken + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken) + '",}\n    </script></html>';
    var cookieJar = { cookies: 'yep' };

    var request = td.replace('../../../lib/utils/request');
    var errorHandler = td.replace('../../../lib/error-handler');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(request(url)).thenReturn(Task.of({ body: body, cookieJar: cookieJar }));
    td.when(errorHandler.videoPageError({
      component: 'session-store',
      operation: 'extractSessionToken',
      html: body
    })).thenReturn(expectedError);

    getSession(videoId).fork(function (e) {
      expect(e).to.deep.equal(expectedError);
      done();
    }, function (res) {
      return done('expected task to fail');
    });
  });

  it('task fails if comments token cannot be found', function (done) {
    var videoId = 'the_video_id';
    var sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var expectedError = { error: 'here' };
    var url = buildVideoPageUrl(videoId);
    var body = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken + '",}\n      var stuff2 = {\'SOMETHING_ELSE_TOKEN\': "' + encodeURIComponent(commentsToken) + '",}\n    </script></html>';
    var cookieJar = { cookies: 'yep' };

    var request = td.replace('../../../lib/utils/request');
    var errorHandler = td.replace('../../../lib/error-handler');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(errorHandler.videoPageError({
      component: 'session-store',
      operation: 'extractCommentsToken',
      html: body
    })).thenReturn(expectedError);
    td.when(request(url)).thenReturn(Task.of({ body: body, cookieJar: cookieJar }));

    getSession(videoId).fork(function (e) {
      expect(e).to.deep.equal(expectedError);
      done();
    }, function (res) {
      return done('expected task to fail');
    });
  });

  it('caches a session', function (done) {
    var video1Id = 'the_first_video_id';
    var sessionToken1 = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken1 = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var body1 = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken1 + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken1) + '",}\n    </script></html>';
    var cookieJar1 = { cookies: 'yep1' };

    var video2Id = 'the_second_video_id';
    var sessionToken2 = 'ABCEDEUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken2 = 'ABCSSaCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var body2 = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken2 + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken2) + '",}\n    </script></html>';
    var cookieJar2 = { cookies: 'yep2' };

    var request = td.replace('../../../lib/utils/request');
    var errorHandler = td.replace('../../../lib/error-handler');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(request(td.matchers.isA(String))).thenReturn(Task.of({ body: body1, cookieJar: cookieJar1 }), Task.of({ body: body2, cookieJar: cookieJar2 }));

    getSession(video1Id).chain(function (res) {
      expect(res).to.deep.equal({
        sessionToken: sessionToken1,
        commentsToken: commentsToken1,
        cookieJar: cookieJar1
      });
      return getSession(video1Id);
    }).fork(function (e) {
      done('should not be rejected ' + e);
    }, function (res) {
      expect(res).to.deep.equal({
        sessionToken: sessionToken1,
        commentsToken: commentsToken1,
        cookieJar: cookieJar1
      });
      done();
    });
  });

  it('does not use cached session for different videos', function (done) {
    var video1Id = 'the_first_video_id';
    var sessionToken1 = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken1 = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var body1 = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken1 + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken1) + '",}\n    </script></html>';
    var cookieJar1 = { cookies: 'yep1' };

    var video2Id = 'the_second_video_id';
    var sessionToken2 = 'ABCEDEUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken2 = 'ABCSSaCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var body2 = '<html><script>\n      var stuff = {\'XSRF_TOKEN\': "' + sessionToken2 + '",}\n      var stuff2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken2) + '",}\n    </script></html>';
    var cookieJar2 = { cookies: 'yep2' };

    var request = td.replace('../../../lib/utils/request');
    var errorHandler = td.replace('../../../lib/error-handler');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(request(td.matchers.isA(String))).thenReturn(Task.of({ body: body1, cookieJar: cookieJar1 }), Task.of({ body: body2, cookieJar: cookieJar2 }));

    getSession(video1Id).chain(function (res) {
      expect(res).to.deep.equal({
        sessionToken: sessionToken1,
        commentsToken: commentsToken1,
        cookieJar: cookieJar1
      });
      return getSession(video2Id);
    }).fork(function (e) {
      done('should not be rejected ' + e);
    }, function (res) {
      expect(res).not.to.deep.equal({
        sessionToken: sessionToken1,
        commentsToken: commentsToken1,
        cookieJar: cookieJar1
      });
      done();
    });
  });

  it('retries if fetching video page fails', function (done) {
    var videoId = 'the_video_id';
    var sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c=';
    var commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY=';
    var url = buildVideoPageUrl(videoId);
    var body = '<html><script>\n      var token1 = {\'XSRF_TOKEN\': "' + sessionToken + '",}\n      var token2 = {\'COMMENTS_TOKEN\': "' + encodeURIComponent(commentsToken) + '",}\n    </script></html>';
    var cookieJar = { cookies: 'yep' };

    var request = td.replace('../../../lib/utils/request');
    var getSession = require('../../../lib/youtube-api/session-store');

    td.when(request(url)).thenReturn(Task.rejected('first one fails'), Task.of({ body: body, cookieJar: cookieJar }));

    getSession(videoId).fork(function (e) {
      return done('got an error ' + e);
    }, function (s) {
      expect(s).to.deep.equal({ sessionToken: sessionToken, commentsToken: commentsToken, cookieJar: cookieJar });
      done();
    });
  });
});