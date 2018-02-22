'use strict';

var _require = require('chai'),
    expect = _require.expect;

var Task = require('data.task');
var Either = require('data.either');

var eitherToTask = require('../../../lib/utils/either-to-task');

describe('/lib/utils/request.js', function () {
  it('exports a function', function () {
    expect(eitherToTask).to.be.a('function');
  });

  it('transforms an Either.Right to a rejected Task', function (done) {
    var value = 'value';
    eitherToTask(Either.of(value)).fork(function (e) {
      return done('got an error ' + e);
    }, function (v) {
      expect(v).to.equal(value);
      done();
    });
  });

  it('transforms an Either.Left to a successful Task', function (done) {
    var value = 'value';
    eitherToTask(Either.Left(value)).fork(function (v) {
      expect(v).to.equal(value);
      done();
    }, function (res) {
      return done('expected task to fail');
    });
  });

  it('natural transformation property holds', function (done) {
    var e = Either.of(1);
    var f = function f(x) {
      return x + 1;
    };

    eitherToTask(e).map(f).fork(function (e) {
      return done('got an error ' + e);
    }, function (r1) {
      eitherToTask(e.map(f)).fork(function (e) {
        return done('got an error ' + e);
      }, function (r2) {
        expect(r1).to.equal(2);
        expect(r2).to.equal(2);
        done();
      });
    });
  });
});