'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Either = require('data.either');
var debug = require('debug')('error-handler');

var _require = require('./utils/cheerio-utils'),
    cheerioLoad = _require.cheerioLoad,
    cheerioFindText = _require.cheerioFindText;

var _require2 = require('./utils/string-utils'),
    strTrim = _require2.strTrim;

var errorTypes = require('./error-types');

var logUnknownError = function logUnknownError(data) {
  var component = data.component,
      operation = data.operation,
      videoId = data.videoId,
      html = data.html;

  debug(['Unknown error - ', videoId ? '[ ' + videoId + ' ] ' : null, component ? component + ':' : null, operation ? operation + ' ' : null, html].filter(Boolean).join(''));

  return data;
};

var buildDefaultError = function buildDefaultError(_ref) {
  var component = _ref.component,
      operation = _ref.operation,
      videoId = _ref.videoId;
  return {
    component: component,
    operation: operation,
    videoId: videoId
  };
};

var errorTypeMatchers = [{
  reg: /available in your country/i,
  type: errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION
}, { reg: /no longer available/i, type: errorTypes.VIDEO_ERROR_UNAVAILABLE }, { reg: /private/i, type: errorTypes.VIDEO_ERROR_PRIVATE }];

var applyErrorTypeMatcher = function applyErrorTypeMatcher(type, matcher, message) {
  return matcher.reg.test(message) ? matcher.type : type;
};

var extractErrorType = function extractErrorType(message, defaultType) {
  return errorTypeMatchers.reduce(function (type, matcher) {
    return applyErrorTypeMatcher(type, matcher, message);
  }, defaultType);
};

var buildVideoPageError = function buildVideoPageError(_ref2) {
  var message = _ref2.message,
      component = _ref2.component,
      operation = _ref2.operation,
      videoId = _ref2.videoId;
  return _extends(buildDefaultError({ component: component, operation: operation, videoId: videoId }), {
    message: message,
    type: extractErrorType(message, errorTypes.VIDEO_ERROR)
  });
};

var videoPageError = function videoPageError(_ref3) {
  var component = _ref3.component,
      operation = _ref3.operation,
      videoId = _ref3.videoId,
      html = _ref3.html;
  return cheerioLoad(html).chain(function ($p) {
    return cheerioFindText($p, '#player-unavailable h1');
  }).leftMap(function (_) {
    return logUnknownError({ component: component, operation: operation, videoId: videoId, html: html });
  }).leftMap(function (_) {
    return Either.of('unknown error');
  }).map(Either.of).merge().map(strTrim).map(function (m) {
    return m.replace(/[\n\t]+/g, ' ');
  }).map(function (message) {
    return buildVideoPageError({ message: message, component: component, operation: operation, videoId: videoId });
  }).merge();
};

var noCommentsError = function noCommentsError(_ref4) {
  var component = _ref4.component,
      operation = _ref4.operation,
      videoId = _ref4.videoId;
  return _extends(buildDefaultError({ component: component, operation: operation, videoId: videoId }), {
    message: 'The video does not have any comments.',
    type: errorTypes.VIDEO_ERROR_NO_COMMENTS
  });
};

var scraperError = function scraperError(_ref5) {
  var component = _ref5.component,
      operation = _ref5.operation,
      videoId = _ref5.videoId,
      message = _ref5.message;
  return _extends(buildDefaultError({ component: component, operation: operation, videoId: videoId }), {
    type: errorTypes.SCRAPER_ERROR,
    message: message
  });
};

module.exports = { videoPageError: videoPageError, noCommentsError: noCommentsError, scraperError: scraperError };