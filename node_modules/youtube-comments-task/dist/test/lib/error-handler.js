'use strict';

var _require = require('chai'),
    expect = _require.expect;

var errorHandler = require('../../lib/error-handler');
var errorTypes = require('../../lib/error-types');

describe('/lib/error-handler.js', function () {
  it('exports an object with function fields', function () {
    expect(errorHandler).to.be.a('object');
    expect(errorHandler).to.have.property('videoPageError').which.is.a('function');
    expect(errorHandler).to.have.property('noCommentsError').which.is.a('function');
    expect(errorHandler).to.have.property('scraperError').which.is.a('function');
  });

  it('videoPageError returns a ' + errorTypes.VIDEO_ERROR + ' object if no html is given', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';

    expect(errorHandler.videoPageError({ component: component, operation: operation, videoId: videoId })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      type: errorTypes.VIDEO_ERROR,
      message: 'unknown error'
    });
  });

  it('videoPageError detects ' + errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION + ' errors', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';
    var message = 'The uploader has not made this video available in your country.';
    var html = '\n      <div>\n        <div id="player-unavailable">\n          <div>\n            <h1>' + message + '</h1>\n          </div>\n        </div>\n      </div>\n    ';

    expect(errorHandler.videoPageError({ component: component, operation: operation, videoId: videoId, html: html })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      message: message,
      type: errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION
    });
  });

  it('videoPageError detects ' + errorTypes.VIDEO_ERROR_UNAVAILABLE + ' errors', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';
    var message = 'This video is no longer available due to a copyright claim by Your Mama.';
    var html = '\n      <div>\n        <div id="player-unavailable">\n          <div>\n            <h1>' + message + '</h1>\n          </div>\n        </div>\n      </div>\n    ';

    expect(errorHandler.videoPageError({ component: component, operation: operation, videoId: videoId, html: html })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      message: message,
      type: errorTypes.VIDEO_ERROR_UNAVAILABLE
    });
  });

  it('videoPageError detects ' + errorTypes.VIDEO_ERROR_PRIVATE + ' errors', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';
    var message = 'This video is private.';
    var html = '\n      <div>\n        <div id="player-unavailable">\n          <div>\n            <h1>' + message + '</h1>\n          </div>\n        </div>\n      </div>\n    ';

    expect(errorHandler.videoPageError({ component: component, operation: operation, videoId: videoId, html: html })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      message: message,
      type: errorTypes.VIDEO_ERROR_PRIVATE
    });
  });

  it('noCommentsError returns a ' + errorTypes.VIDEO_ERROR_NO_COMMENTS + ' error', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';
    var message = 'The video does not have any comments.';

    expect(errorHandler.noCommentsError({ component: component, operation: operation, videoId: videoId })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      message: message,
      type: errorTypes.VIDEO_ERROR_NO_COMMENTS
    });
  });

  it('scraperError returns a ' + errorTypes.SCRAPER_ERROR + ' error', function () {
    var component = 'test-component';
    var operation = 'test-operation';
    var videoId = 'test-video';
    var message = 'The video does not have any comments.';

    expect(errorHandler.scraperError({ component: component, operation: operation, videoId: videoId, message: message })).to.deep.equal({
      component: component,
      operation: operation,
      videoId: videoId,
      message: message,
      type: errorTypes.SCRAPER_ERROR
    });
  });
});