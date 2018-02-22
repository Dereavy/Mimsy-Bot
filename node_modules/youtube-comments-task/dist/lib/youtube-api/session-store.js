'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Task = require('data.task');
var Either = require('data.either');

var _require = require('control.monads'),
    liftMN = _require.liftMN;

var _require2 = require('retry-task'),
    delayedRetry = _require2.delayedRetry;

var eitherToTask = require('../utils/either-to-task');

var _require3 = require('./url-builder'),
    buildVideoPageUrl = _require3.buildVideoPageUrl;

var request = require('../utils/request');

var _require4 = require('../error-handler'),
    videoPageError = _require4.videoPageError;

var extractToken = function extractToken(html, regex) {
  return Either.fromNullable(regex.exec(html)).chain(function (m) {
    return Either.fromNullable(m[1]);
  }).map(function (token) {
    return decodeURIComponent(token);
  });
};

var extractSessionToken = function extractSessionToken(html) {
  return extractToken(html, /'XSRF_TOKEN'\s*\n*:\s*\n*"(.*)"/i).leftMap(function (_) {
    return videoPageError({
      component: 'session-store',
      operation: 'extractSessionToken',
      html: html
    });
  });
};

var extractCommentsToken = function extractCommentsToken(html) {
  return extractToken(html, /'COMMENTS_TOKEN'\s*\n*:\s*\n*"([^"]+)"/i).leftMap(function (_) {
    return videoPageError({
      component: 'session-store',
      operation: 'extractCommentsToken',
      html: html
    });
  });
};

// TODO: make # retries configurable
var withRetries = delayedRetry(3, function (n) {
  return n * n * 500;
});

var fetchVideoPage = function fetchVideoPage(videoId) {
  return request(buildVideoPageUrl(videoId));
};

var fetchVideoPageWithRetries = function fetchVideoPageWithRetries(videoId) {
  return withRetries(function () {
    return fetchVideoPage(videoId);
  });
};

var buildSession = function buildSession(sessionToken, commentsToken, cookieJar) {
  return {
    sessionToken: sessionToken,
    commentsToken: commentsToken,
    cookieJar: cookieJar
  };
};

var getSession = function getSession(videoId) {
  return fetchVideoPageWithRetries(videoId).chain(function (_ref) {
    var body = _ref.body,
        cookieJar = _ref.cookieJar;
    return liftMN(buildSession, [eitherToTask(extractSessionToken(body)), eitherToTask(extractCommentsToken(body)), Task.of(cookieJar)]);
  });
};

// TODO: make cacheTtl configurable
var cacheTtl = 1000 * 60 * 2; // 2 minutes
var cache = {};

/*
 * NOTE: this function is impure (shame on me), but I don't know how else to
 *       cache lazy async operations.
 */
var cachedGetSession = function cachedGetSession(videoId) {
  var cached = cache[videoId];
  if (cached && cached.data && cached.maxAge > Date.now()) {
    return Task.of(cached.data);
  } else if (cached && cached.maxAge <= Date.now()) {
    delete cache[videoId];
  }

  return getSession(videoId).map(function (res) {
    cache[videoId] = {};
    cache[videoId].data = _extends({}, res);
    cache[videoId].maxAge = Date.now() + cacheTtl;
    return res;
  });
};

module.exports = cachedGetSession;