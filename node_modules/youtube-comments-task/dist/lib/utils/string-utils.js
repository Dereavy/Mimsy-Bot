'use strict';

var Either = require('data.either');

var strTrim = function strTrim(str) {
  return str.trim();
};

var strToInt = function strToInt(s) {
  return Either.fromNullable(parseInt(s, 10)).chain(function (x) {
    return isNaN(x) ? Either.Left('Cannot parse "' + s + '" to an int') : Either.of(x);
  }).leftMap(function (_) {
    return 'Cannot parse "' + s + '" to an int';
  });
};

var regExec = function regExec(regex, str) {
  return Either.fromNullable(regex.exec(str)).leftMap(function (_) {
    return str + ' does not contain a match for ' + regex.toString();
  });
};

module.exports = {
  strTrim: strTrim,
  strToInt: strToInt,
  regExec: regExec
};