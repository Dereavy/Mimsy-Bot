'use strict';

var _require = require('chai'),
    expect = _require.expect;

var strUtils = require('../../../lib/utils/string-utils');

describe('/lib/utils/string-utils.js', function () {
  it('exports an object with methods', function () {
    expect(strUtils).to.be.a('object');
    expect(strUtils.strTrim).to.be.a('function');
    expect(strUtils.strToInt).to.be.a('function');
    expect(strUtils.regExec).to.be.a('function');
  });

  it('strTrim trims a string', function () {
    expect(strUtils.strTrim(' \n blah   \t')).to.equal('blah');
  });

  it('strToInt parses a string to an int', function () {
    strUtils.strToInt('199').fold(function (e) {
      return expect.fail('got an error ' + e);
    }, function (x) {
      return expect(x).to.equal(199);
    });
  });

  it('strToInt fails if the string cannot be parsed', function () {
    strUtils.strToInt('ABSC').fold(function (e) {
      expect(e).to.exist;
    }, function (x) {
      expect.fail('expected to fail ' + x);
    });
  });

  it('regExec executes a regular expression on a string', function () {
    strUtils.regExec(/a(b)c/, 'abc').fold(function (e) {
      return expect.fail('got an error ' + e);
    }, function (m) {
      expect(m).to.be.a('array').of.length(2);
      expect(m[1]).to.equal('b');
    });
  });

  it('regExec failes if there is no match', function () {
    var reg = /a(b)c/;
    var str = 'xyz';

    strUtils.regExec(reg, str).fold(function (e) {
      expect(e).to.equal(str + ' does not contain a match for ' + reg.toString());
    }, function (x) {
      return expect.fail('expected to fail ' + x);
    });
  });
});