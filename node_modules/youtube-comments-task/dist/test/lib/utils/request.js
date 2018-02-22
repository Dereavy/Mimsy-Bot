'use strict';

var _require = require('chai'),
    expect = _require.expect;

var Task = require('data.task');

var request = require('../../../lib/utils/request');

describe('/lib/utils/request.js', function () {
  it('exports a function', function () {
    expect(request).to.be.a('function');
  });

  it('function returns a Task', function () {
    expect(request()).to.be.instanceof(Task);
  });

  it('Task is rejected for invalid URLs', function (done) {
    this.timeout(10000);

    request().fork(function (e) {
      expect(e).to.exist;
      request('http://nosuchdomain.fake').fork(function (e) {
        expect(e).to.exist;
        done();
      }, function (r) {
        return done('expected task to fail');
      });
    }, function (r) {
      return done('expected task to fail');
    });
  });

  it('Task is rejected for invalid status codes', function (done) {
    this.timeout(10000);

    request('http://google.com/no/such/path').fork(function (e) {
      expect(e).to.exist;
      done();
    }, function (r) {
      return done('expected task to fail');
    });
  });

  it('Task is fulfilled for valid requests', function (done) {
    this.timeout(10000);

    request('http://www.google.com/').fork(function (e) {
      return done('got an error ' + e);
    }, function (x) {
      expect(x).to.be.an('object').with.property('body');
      expect(x.body).to.be.a('string').and.to.match(/<html/i);
      done();
    });
  });
});