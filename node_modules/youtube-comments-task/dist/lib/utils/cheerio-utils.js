'use strict';

var cheerio = require('cheerio');
var Either = require('data.either');

var cheerioLoad = function cheerioLoad(html) {
  return Either.fromNullable(cheerio.load('<div id="_ROOT">' + html + '</div>')).map(function ($) {
    return $('#_ROOT');
  });
};

var cheerioFind = function cheerioFind($e, sel) {
  return $e.find(sel).length > 0 ? Either.of($e.find(sel)) : Either.Left('No matches for ' + sel);
};

var cheerioFindAll = function cheerioFindAll($e, sel) {
  return cheerioFind($e, sel).map(function ($m) {
    return $m.toArray().map(cheerio);
  });
};

var cheerioAttr = function cheerioAttr($e, attr) {
  return Either.fromNullable($e.attr(attr)).leftMap(function (_) {
    return 'Attribute ' + attr + ' not found on ' + $e;
  });
};

var cheerioFindText = function cheerioFindText($e, sel) {
  return cheerioFind($e, sel).map(function (r) {
    return r.text();
  });
};

var cheerioFindAttr = function cheerioFindAttr($e, sel, attr) {
  return cheerioFind($e, sel).chain(function ($r) {
    return cheerioAttr($r, attr);
  });
};

module.exports = {
  cheerio: cheerio,
  cheerioLoad: cheerioLoad,
  cheerioFind: cheerioFind,
  cheerioFindAll: cheerioFindAll,
  cheerioAttr: cheerioAttr,
  cheerioFindText: cheerioFindText,
  cheerioFindAttr: cheerioFindAttr
};