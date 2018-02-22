'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var moment = require('moment');
var Either = require('data.either');

var _require = require('ramda'),
    pickBy = _require.pickBy;

var _require2 = require('./utils/string-utils'),
    strTrim = _require2.strTrim,
    strToInt = _require2.strToInt,
    regExec = _require2.regExec;

var _require3 = require('./utils/cheerio-utils'),
    cheerioAttr = _require3.cheerioAttr,
    cheerioFindText = _require3.cheerioFindText,
    cheerioFindAttr = _require3.cheerioFindAttr;

var resolveAny = function resolveAny(e, def) {
  return e.fold(function (_) {
    return def;
  }, function (x) {
    return x;
  });
};

var compact = pickBy(function (v) {
  return v != null && v !== '';
});

var extractLikes = function extractLikes($c) {
  return cheerioFindText($c, '.comment-action-buttons-toolbar > .comment-renderer-like-count.on').chain(strToInt).map(function (l) {
    return l - 1;
  });
};

var parseFromNow = function parseFromNow(fromNow) {
  return regExec(/(\d+)\s(\w+)\sago/, fromNow).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        _ = _ref2[0],
        n = _ref2[1],
        u = _ref2[2];

    return moment().subtract(n, u).valueOf();
  });
};

var commentEdited = function commentEdited($c) {
  return cheerioFindText($c, '.comment-renderer-header > .comment-renderer-time').map(function (t) {
    return (/\(edited\)/i.test(t)
    );
  });
};

var extractTime = function extractTime($c) {
  return cheerioFindText($c, '.comment-renderer-header > .comment-renderer-time').map(function (t) {
    return t.replace(/\s*\(edited\)/i, '');
  }).map(strTrim);
};

var addTimestamp = function addTimestamp(comment) {
  return Either.fromNullable(comment.time).chain(parseFromNow).map(function (timestamp) {
    return _extends({}, comment, { timestamp: timestamp });
  });
};

var extractFields = function extractFields($c) {
  return {
    id: resolveAny(cheerioAttr($c, 'data-cid').map(strTrim)),
    author: resolveAny(cheerioFindText($c, '.comment-author-text').map(strTrim)),
    authorLink: resolveAny(cheerioFindAttr($c, 'a.comment-author-text', 'href').map(strTrim)),
    authorThumb: resolveAny(cheerioFindAttr($c, '.comment-author-thumbnail img', 'src').map(strTrim)),
    text: resolveAny(cheerioFindText($c, '.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').map(strTrim)),
    likes: resolveAny(extractLikes($c)),
    time: resolveAny(extractTime($c)),
    edited: resolveAny(commentEdited($c))
  };
};

var parseCommentRenderer = function parseCommentRenderer($commentRenderer) {
  return Either.fromNullable($commentRenderer).leftMap(function (_) {
    return '$commentRenderer parameter must be defined';
  }).map(extractFields).map(compact).map(function (c) {
    return resolveAny(addTimestamp(c), c);
  });
};

module.exports = parseCommentRenderer;