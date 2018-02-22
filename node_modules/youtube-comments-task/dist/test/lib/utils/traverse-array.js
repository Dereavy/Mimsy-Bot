'use strict';

var _require = require('chai'),
    expect = _require.expect;

var Either = require('data.either');

var traverse = require('../../../lib/utils/traverse-array');

var arr = ['a', 'b', 'c', 'd'];

describe('/lib/utils/traverse-array.js', function () {
  it('exports a function', function () {
    expect(traverse).to.be.a('function');
  });

  it('traverses the array', function () {
    expect(traverse(arr, Either.of, Either.of)).to.deep.equal(Either.of(arr));
  });

  it('fails if an array member fails', function () {
    var error = 'error';
    var count = 0;
    var res = traverse(arr, Either.of, function (x) {
      return count++ !== 3 ? Either.of(x) : Either.Left(error);
    });

    res.fold(function (e) {
      expect(e).to.deep.equal(error);
    }, function (s) {
      expect.fail('expected to fail');
    });
  });
});